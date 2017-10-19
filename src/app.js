const opcua = require("node-opcua");
const express = require('express');
const bodyParser = require('body-parser');

const actionDispatch = require("./actionDispatch");
const httpRequestParse = require("./httpRequestParse");

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
        if(opcClientSession){
            actionDispatch(opcClientSession, httpRequestParse(req))
            .then((response)=>{
                res.statusCode = 200;
                res.send(response);
            })
            .catch(()=>{
                res.statusCode = 502;
                res.send();
            });
        } else {
            res.statusCode = 502;
            res.send();
        }
    });

    api.listen(port, function () {
      console.log(`API listening on port ${port}!`)
    })

}

module.exports = app;
