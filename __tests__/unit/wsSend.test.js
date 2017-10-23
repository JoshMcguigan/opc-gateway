const wsSend = require('../../src/wsSend');

let string, ws, wsOPCSubscriptions, terminate;

const getSendFunction = (error) =>{
    return jest.fn(
        (string, callback)=>
        {
            callback(error);
        });
}

describe('Test successful sends', ()=>{
    beforeEach(()=>{
        string = "test";
        ws = {
            send: getSendFunction(false)
        };
        terminate = jest.fn();
        wsOPCSubscriptions = new Map();
        wsOPCSubscriptions.set(ws, {subscription:{terminate: terminate}});
    });

    test('should call send function on websocket', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(ws.send.mock.calls.length).toBe(1);
    });

    test('should not call terminate if send does not return error', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(terminate.mock.calls.length).toBe(0);
    });

    test('should not remove ws connection from map if send does not return error', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(wsOPCSubscriptions.has(ws)).toBe(true);
    });
});

describe('Test sends with error', ()=>{
    beforeEach(()=>{
        string = "test";
        ws = {
            send: getSendFunction(true)
        };
        terminate = jest.fn();
        wsOPCSubscriptions = new Map();
        wsOPCSubscriptions.set(ws, {subscription:{terminate: terminate}});
    });

    test('should call send function on websocket', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(ws.send.mock.calls.length).toBe(1);
    });

    test('should call terminate if send returns error', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(terminate.mock.calls.length).toBe(1);
    });

    test('should remove ws connection from map if send returns error', ()=>{
        wsSend(string, ws, wsOPCSubscriptions);
        expect(wsOPCSubscriptions.has(ws)).toBe(false);
    });
});
