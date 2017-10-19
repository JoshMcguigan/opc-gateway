const httpRequestParse = require('../../src/httpRequestParse');

test('httpRequestParse should be a function', ()=>{
    expect(typeof httpRequestParse).toBe('function');
});

test('should correctly parse empty body', ()=>{
    let httpRequest = {body:{}};
    expect(httpRequestParse(httpRequest)).toEqual({});
});

test('should correctly parse read request',()=>{
    let httpRequest = {
        body:{
            readVariableValue: [["testpath1", "testpath2"]]
        }
    };
    expect(httpRequestParse(httpRequest)).toEqual(httpRequest.body);
});

test('should correctly parse browse request', ()=>{
    let httpRequest = {
        body:{
            browse: [["testpath1", "testpath2"]]
        }
    };
    expect(httpRequestParse(httpRequest)).toEqual(httpRequest.body);
});

test('should correctly parse combined request', ()=>{
    let httpRequest = {
        body:{
            readVariableValue: [["testpath1", "testpath2"]],
            browse: [["testpath1", "testpath2"]]
        }
    };
    expect(httpRequestParse(httpRequest)).toEqual(httpRequest.body);
});

test('should ignore bad parts of request',()=>{
    let goodRequests = {
        readVariableValue: [["testpath1", "testpath2"]],
        browse: [["testpath1", "testpath2"]]
    }
    let httpRequest = {
        body:{
            readVariableValue: [["testpath1", "testpath2"]],
            browse: [["testpath1", "testpath2"]],
            badRequest: 'bad'
        }
    };
    expect(httpRequestParse(httpRequest)).toEqual(goodRequests);
});

// check for malformed inputs (maybe?)
