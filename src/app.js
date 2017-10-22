const opcua = require('node-opcua');
const express = require('express');
const bodyParser = require('body-parser');

const requestHandler = require('./requestHandler');

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

    api.ws('/api', function(ws, req) {
        ws.on('message', function(req) {
            let allowedActions = ['readVariableValue', 'browse'];
            requestHandler(opcClientSession, req, allowedActions)
            .then((response)=>{
                ws.send(JSON.stringify(response));
            });
        });
    });

    api.listen(port, function () {
      console.log(`API listening on port ${port}!`)
    });

}

module.exports = app;
