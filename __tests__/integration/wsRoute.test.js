const WebSocket = require('ws');

let ws;

beforeEach(()=>{
    ws = new WebSocket('ws://localhost:3000/api');
});

test('Server accepts websockets connection at /api', (done)=>{
    ws.on('open', function() {
        done();
    });
});

test('return status code 200 reading multiple variables', (done) => {
    let requestData = {
        "readVariableValue": ["ns=1;s=FanSpeed", "ns=1;s=PumpSpeed", "ns=1;s=SomeDate"]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject.statusCode).toBe(200);
        done();
    });
});

test('return status code 200 reading single variable', (done) => {
    let requestData = {
        "readVariableValue": "ns=1;s=FanSpeed"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject.statusCode).toBe(200);
        done();
    });
});

test('return appropriate data when reading single value', (done)=>{
    // "ns=1;s=SomeDate" used here because the value does not change on the test server
    let requestData = {
        "readVariableValue": "ns=1;s=SomeDate"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject).toMatchSnapshot();
        done();
    });
});

test('return appropriate data when reading multiple values', (done)=>{
    // "ns=1;s=SomeDate" used here because the value does not change on the test server
    let requestData = {
        "readVariableValue": ["ns=1;s=SomeDate", "ns=1;s=SomeDate"]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject).toMatchSnapshot();
        done();
    });
});

test('return status code 200 when requesting browse to single folder which exists', (done)=>{
    // "RootFolder" exists on test server
    let requestData = {
        "browse": "RootFolder"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject.statusCode).toBe(200);
        done();
    });
});

test('return status code 200 when requesting browse to multiple folders which exist', (done)=>{
    // "RootFolder" exists on test server
    let requestData = {
        "browse": ["RootFolder", "RootFolder"]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject.statusCode).toBe(200);
        done();
    });
});

test('return status code 502 when requesting browse to folder which does not exist', (done)=>{
    let requestData = {
        "browse": "madeUpFolderName"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject.statusCode).toBe(502);
        done();
    });
});

test('return appropriate data when requesting browse to single folder which exists', (done)=>{
    // "RootFolder" exists on test server
    let requestData = {
        "browse": "RootFolder"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject).toMatchSnapshot();
        done();
    });
});

test('return appropriate data when requesting browse to multiple folders which exist', (done)=>{
    // "RootFolder" exists on test server
    let requestData = {
        "browse": ["RootFolder", "RootFolder"]
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject).toMatchSnapshot();
        done();
    });
});

test('return appropriate data when browsing and reading in single request', (done)=>{
    let requestData = {
        "browse": "RootFolder",
        "readVariableValue": "ns=1;s=SomeDate"
    };
    ws.on('open', function open() {
        ws.send(JSON.stringify(requestData));
    });
    ws.on('message', function(response){
        let responseObject = JSON.parse(response);
        expect(responseObject).toMatchSnapshot();
        done();
    });
});
