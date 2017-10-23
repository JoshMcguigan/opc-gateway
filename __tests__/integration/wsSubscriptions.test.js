const WebSocket = require('ws');

let ws;

beforeEach(()=>{
    ws = new WebSocket('ws://localhost:3000/subscribe');
});

afterEach(()=>{
    ws.close();
});

test('it should allow subscriptions for single opc path', (done) => {
    let opcPath = "ns=1;s=PumpSpeed";
    let requestData = {
        "subscribe": opcPath
    };

    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        expect(opcPath in JSON.parse(response)).toBe(true);
        done();
    });
});

test('it should allow subscriptions for multiple opc paths in an array', (done) => {
    let opcPaths = ["ns=1;s=PumpSpeed", "ns=1;s=FanSpeed"];
    let dataReceived = [false, false];
    let requestData = {
        "subscribe": opcPaths
    };

    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        Object.keys(responseObject).forEach((opcItemPath)=>{
            let index = opcPaths.indexOf(opcItemPath);
            if(index>=0){
                dataReceived[index] = true;
            }
        });
        if (dataReceived.every(element=>element)){
            done();
        }
    });
});

test('it should allow subscriptions for multiple opc paths subscribed in seperate messages', (done) => {
    let opcPaths = ["ns=1;s=PumpSpeed", "ns=1;s=FanSpeed"];
    let dataReceived = [false, false];
    let requestData0 = {
        "subscribe": opcPaths[0]
    };
    let requestData1 = {
        "subscribe": opcPaths[1]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData0));
        ws.send(JSON.stringify(requestData1));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        Object.keys(responseObject).forEach((opcItemPath)=>{
            let index = opcPaths.indexOf(opcItemPath);
            if(index>=0){
                dataReceived[index] = true;
            }
        });
        if (dataReceived.every(element=>element)){
            done();
        }
    });
});

test('it should allow unsubscribing from a single tag', (done) => {
    let opcPaths = ["ns=1;s=PumpSpeed", "ns=1;s=FanSpeed"];
    let requestData = {
        "subscribe": opcPaths
    };
    let requestUnsubscribe = {
        "unsubscribe": opcPaths[1]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
        setTimeout(
            ()=>{
                ws.send(JSON.stringify(requestUnsubscribe));
                setTimeout(()=>{
                    ws.on('message', function(response){
                        let responseObject = JSON.parse(response);
                        expect(opcPaths[1] in JSON.parse(response)).toBe(false);
                    });
                }, 500)
            }
            , 500
        );
    });

    setTimeout(done, 4000);
});

test('it should allow unsubscribing from multiple tags with an array', (done) => {
    let opcPaths = ["ns=1;s=PumpSpeed", "ns=1;s=FanSpeed"];
    let requestData = {
        "subscribe": opcPaths
    };
    let requestUnsubscribe = {
        "unsubscribe": opcPaths
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
        setTimeout(
            ()=>{
                ws.send(JSON.stringify(requestUnsubscribe));
                setTimeout(()=>{
                    ws.on('message', function(response){
                        // fail on any message
                        expect(true).toBe(false);
                        done();
                    });
                }, 500)
            }
            , 500
        );
    });

    setTimeout(done, 4000);
});

// test immediately unsubscribing to ensure it doesn't crash application
