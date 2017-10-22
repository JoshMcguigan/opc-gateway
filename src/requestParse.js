const isObject = function(obj) {
  return obj !== null && typeof obj === 'object';
}

const isString = function(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

const httpRequestParse = function(request, allowedActions){
    let parsedRequest = {};

    if(isString(request)){
        try{
            request = JSON.parse(request);
        } catch(error) {
            request = {};
        }
    }

    if(isObject(request)){
        allowedActions.forEach((action)=>{
            if(action in request){
                parsedRequest[action] = request[action];
            }
        });
    }

    return parsedRequest;
}

module.exports = httpRequestParse;
