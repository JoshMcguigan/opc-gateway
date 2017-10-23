const wsSend = function(string, ws, wsOPCSubscriptions){
    ws.send(string, (error)=>{
        if (error){
            wsOPCSubscriptions.get(ws).subscription.terminate();
            wsOPCSubscriptions.delete(ws);
        }
    })
};

module.exports = wsSend;
