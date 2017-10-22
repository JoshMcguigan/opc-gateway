const opcua = require('node-opcua');
const express = require('express');
const bodyParser = require('body-parser');

const actionDispatch = require('./actionDispatch');
const requestParse = require('./requestParse');

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
        let parsedRequest = requestParse(req.body, allowedActions);
        actionDispatch(opcClientSession, parsedRequest)
        .then((body)=>{
            res.statusCode = 200;
            res.send(body);
        })
        .catch(()=>{
            res.statusCode = 502;
            res.send({});
        });
    });

    api.ws('/api', function(ws, req) {
        ws.on('message', function(req) {
            let allowedActions = ['readVariableValue', 'browse'];
            let parsedRequest = requestParse(req, allowedActions);
            actionDispatch(opcClientSession, parsedRequest)
            .then((body)=>{
                let response = {
                    statusCode: 200,
                    body: body
                };
                ws.send(JSON.stringify(response));
            })
            .catch(()=>{
                let response = {
                    statusCode: 502,
                    body: {}
                };
                ws.send(JSON.stringify(response));
            });
        });
    });

    api.listen(port, function () {
      console.log(`API listening on port ${port}!`)
    });

}

module.exports = app;
