const requestParse = require('../../src/requestParse');

let allowedActions = ['readVariableValue', 'browse'];

test('requestParse should be a function', ()=>{
    expect(typeof requestParse).toBe('function');
});

test('it should correctly parse empty request', ()=>{
    let request = {};
    expect(requestParse(request, allowedActions)).toEqual({});
});

test('it should return empty object when passed something which is not an object or valid JSON', ()=>{
    let request = 'badRequest';
    expect(requestParse(request, allowedActions)).toEqual({});
});

test('it should correctly parse read request',()=>{
    let request = {
        readVariableValue: [["testpath1", "testpath2"]]
    };
    expect(requestParse(request, allowedActions)).toEqual(request);
});

test('it should correctly parse valid JSON', ()=>{
    let request = {
        readVariableValue: [["testpath1", "testpath2"]]
    };
    let requestString = JSON.stringify(request);
    expect(requestParse(requestString, allowedActions)).toEqual(request);
});

test('it should correctly parse browse request', ()=>{
    let request = {
        browse: [["testpath1", "testpath2"]]
    };
    expect(requestParse(request, allowedActions)).toEqual(request);
});

test('it should correctly parse combined request', ()=>{
    let request = {
        readVariableValue: [["testpath1", "testpath2"]],
        browse: [["testpath1", "testpath2"]]
    };
    expect(requestParse(request, allowedActions)).toEqual(request);
});

test('it should ignore bad parts of request',()=>{
    let goodRequests = {
        readVariableValue: [["testpath1", "testpath2"]],
        browse: [["testpath1", "testpath2"]]
    }
    let request = {
        readVariableValue: [["testpath1", "testpath2"]],
        browse: [["testpath1", "testpath2"]],
        badRequest: 'bad'
    };
    expect(requestParse(request, allowedActions)).toEqual(goodRequests);
});

// check for malformed inputs (maybe?)
