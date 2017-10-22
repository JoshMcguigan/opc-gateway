const actionDispatch = require('./actionDispatch');
const requestParse = require('./requestParse');

const requestHandler = function(opcClientSession, req, allowedActions){
    return new Promise((resolve, reject)=>{
        let parsedRequest = requestParse(req, allowedActions);
        let response = {
            statusCode: null,
            body: {}
        };
        actionDispatch(opcClientSession, parsedRequest)
        .then((body)=>{
            response.statusCode = 200;
            response.body = body;
            resolve(response);
        })
        .catch(()=>{
            response.statusCode = 502;
            resolve(response);
        });
    })
}

module.exports = requestHandler;
