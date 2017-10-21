const opcua = require('node-opcua');
const express = require('express');
const bodyParser = require('body-parser');

const httpRequestHandler = require('./httpRequestHandler');

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

    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({ extended: true }));

    api.post('/api', function(req, res){
        httpRequestHandler(opcClientSession, req, res);
    });

    api.listen(port, function () {
      console.log(`API listening on port ${port}!`)
    })

}

module.exports = app;
