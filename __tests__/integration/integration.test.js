const request = require('supertest');

describe('api route tests', function(){

    let api;

    beforeEach(function(){
        api = 'localhost:3000';
    });

    test('return status code 200 reading multiple variables', (done) => {
        let requestData = {
            "readVariableValue": ["ns=1;s=FanSpeed", "ns=1;s=PumpSpeed", "ns=1;s=SomeDate"]
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('return status code 200 reading single variable', (done)=>{
        let requestData = {
            "readVariableValue": "ns=1;s=SomeDate"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('return appropriate data when reading single value', (done)=>{
        // "ns=1;s=SomeDate" used here because the value does not change on the test server
        let requestData = {
            "readVariableValue": "ns=1;s=SomeDate"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.body).toMatchSnapshot();
            done();
        });
    });

    test('return appropriate data when reading multiple values', (done)=>{
        // "ns=1;s=SomeDate" used here because the value does not change on the test server
        let requestData = {
            "readVariableValue": ["ns=1;s=SomeDate", "ns=1;s=SomeDate"]
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.body).toMatchSnapshot();
            done();
        });
    });

    test('return status code 200 when requesting browse to single folder which exists', (done)=>{
        // "RootFolder" exists on test server
        let requestData = {
            "browse": "RootFolder"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('return status code 200 when requesting browse to multiple folders which exist', (done)=>{
        // "RootFolder" exists on test server
        let requestData = {
            "browse": ["RootFolder", "RootFolder"]
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('return status code 502 when requesting browse to folder which does not exist', (done)=>{
        let requestData = {
            "browse": "madeUpFolderName"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.statusCode).toBe(502);
            done();
        });
    });

    test('return appropriate data when requesting browse to single folder which exists', (done)=>{
        // "RootFolder" exists on test server
        let requestData = {
            "browse": "RootFolder"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.body).toMatchSnapshot();
            done();
        });
    });

    test('return appropriate data when requesting browse to multiple folders which exist', (done)=>{
        // "RootFolder" exists on test server
        let requestData = {
            "browse": ["RootFolder", "RootFolder"]
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.body).toMatchSnapshot();
            done();
        });
    });

    test('return appropriate data when browsing and reading in single request', (done)=>{
        let requestData = {
            "browse": "RootFolder",
            "readVariableValue": "ns=1;s=SomeDate"
        };
        request(api).post('/api/').send(requestData).then((response) => {
            expect(response.body).toMatchSnapshot();
            done();
        });
    });

});
