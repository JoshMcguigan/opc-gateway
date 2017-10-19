const httpRequestParse = function(request){
    let parsedResponse = {};

    let allowedAction = ['readVariableValue', 'browse'];

    allowedAction.forEach((action)=>{
        if(action in request.body){
            parsedResponse[action] = request.body[action];
        }
    });

    return parsedResponse;
}

module.exports = httpRequestParse;
