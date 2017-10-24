const opcua = require('node-opcua');
const express = require('express');
const bodyParser = require('body-parser');

const requestHandler = require('./requestHandler');
const wsSend = require('./wsSend');

const app = function(opcEndpointUrl, port){

    const opcClient = new opcua.OPCUAClient({
        keepSessionAlive: true
    });

    let opcClientSession;

    opcClient.connect(opcEndpointUrl, function(err){
        if(!err) {
            opcClient.createSession(function(err,session){
                if(!err) {
                    opcClientSession = session;
                }
            });
        }
    });

    const api = express();
    const expressWs = require('express-ws')(api);

    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({ extended: true }));

    api.post('/api', function(req, res){
        let allowedActions = ['readVariableValue', 'browse'];
        requestHandler(opcClientSession, req.body, allowedActions)
        .then((response)=>{
            res.statusCode = response.statusCode;
            res.send(response.body);
        });
    });

    // Map (WebSocket Connection => {subscription, monitoredItems})
    let wsOPCSubscriptions = new Map();

    api.ws('/api', function(ws, req) {
        ws.on('message', function(req) {
            let allowedActions = ['readVariableValue', 'browse'];
            requestHandler(opcClientSession, req, allowedActions)
            .then((response)=>{
                response['request'] = req;
                wsSend(JSON.stringify(response), ws, wsOPCSubscriptions);
            });
        });
    });

    api.ws('/subscribe', function(ws, req) {
        if (!wsOPCSubscriptions.has(ws)){
            let subscription = new opcua.ClientSubscription(opcClientSession,{
                    requestedPublishingInterval: 1000,
                    requestedLifetimeCount: 10,
                    requestedMaxKeepAliveCount: 2,
                    maxNotificationsPerPublish: 10,
                    publishingEnabled: true,
                    priority: 10
                }
            );
            wsOPCSubscriptions.set(ws,
                {
                    subscription: subscription,
                    monitoredItems: {}
                }
            );
        }

        ws.on('message', function(req) {
            let requestObject = JSON.parse(req);

            if('subscribe' in requestObject){
                let opcPaths = requestObject.subscribe;
                let subscription = wsOPCSubscriptions.get(ws).subscription;
                let monitoredItems = wsOPCSubscriptions.get(ws).monitoredItems;

                if (!(opcPaths instanceof Array)){
                    opcPaths = [opcPaths];
                }

                opcPaths.forEach((opcPath)=>{
                    if(!(opcPath in Object.keys(monitoredItems))){
                        let monitoredItem  = subscription.monitor({
                                nodeId: opcua.resolveNodeId(opcPath),
                                attributeId: opcua.AttributeIds.Value
                            },
                            {
                                samplingInterval: 100,
                                discardOldest: true,
                                queueSize: 10
                            },
                            opcua.read_service.TimestampsToReturn.Both
                        );

                        monitoredItem.on("changed",function(dataValue){
                            let value = dataValue.value.value;
                            // TODO reformat this response object so it is more consistent with the read/browse API above
                            let responseObject = {};
                            responseObject[opcPath] = dataValue;
                            // Don't send to websocket connections who have been terminated and removed from wsOPCSubscriptions
                            if(wsOPCSubscriptions.has(ws)){
                                wsSend(JSON.stringify(responseObject), ws, wsOPCSubscriptions);
                            } else {
                                monitoredItem.terminate();
                            }
                        });

                        monitoredItems[opcPath] = monitoredItem;
                    }
                });
            }

            if('unsubscribe' in requestObject){
                let opcPaths = requestObject.unsubscribe;
                let subscription = wsOPCSubscriptions.get(ws).subscription;
                let monitoredItems = wsOPCSubscriptions.get(ws).monitoredItems;

                if (!(opcPaths instanceof Array)){
                    opcPaths = [opcPaths];
                }

                opcPaths.forEach((opcPath)=>{
                    if(opcPath in monitoredItems){
                        monitoredItems[opcPath].terminate();
                        delete monitoredItems[opcPath];
                    }
                });
            }
        });
    });


    api.listen(port, function () {
      console.log(`API listening on port ${port}!`)
    });

}

module.exports = app;
