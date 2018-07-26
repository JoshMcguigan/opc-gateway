const promiseWrap = function(opcClientSession, func, args){
    if (!opcClientSession) {
        throw new Error('Not connected to OPC server');
    }

    promise = new Promise((resolve, reject)=>{
        // TODO appropriately handle function calls with more than one argument by unpacking args array
        opcClientSession[func](args, (error, data)=>{
            if (!error){
                let result = {};
                result[func] = data;
                resolve(result);
            } else {
                reject(error);
            }
        });

    });

    return promise;
};

const actionDispatch = function(opcClientSession, actions){
    promise = new Promise((resolve, reject)=>{
        let promises = [];

        Object.keys(actions).forEach((action)=>{
            let args = actions[action];
            promises.push(promiseWrap(opcClientSession, action, args));
        });

        Promise.all(promises)
        .then(
            (data)=>{
                if (data.length>0){
                    resolve(Object.assign.apply(Object, data));
                } else {
                    resolve({});
                }
            }
        )
        .catch(
            (error) =>{
                reject(error);
            }
        );
    });

    return promise;
}

module.exports = actionDispatch;
