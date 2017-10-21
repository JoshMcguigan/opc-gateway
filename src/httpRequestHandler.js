const actionDispatch = require("./actionDispatch");
const httpRequestParse = require("./httpRequestParse");

const httpRequestHandler = function(opcClientSession, req, res){
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
};

module.exports = httpRequestHandler;
