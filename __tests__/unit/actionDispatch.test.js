const actionDispatch = require('../../src/actionDispatch');

const mock = jest.fn((args, callback)=>{
    let _this = null;
    let error = null;
    // mock function returns what it is given
    setTimeout(callback.bind(_this, error, args), 0);
});

const opcClientSession = {
    readVariableValue: mock,
    browse: mock
};

test('actionDispatch should be a function', ()=>{
    expect(typeof actionDispatch).toBe('function');
});

test('actionDispatch should return promise with empty object when called with no actions', (done)=>{
    const actions = {};
    actionDispatch(opcClientSession, actions).then((opcData)=>{
        expect(opcData).toEqual({});
        done();
    })
});

test('actionDispatch should return promise with results of calling each action', (done)=>{
    const actions = {
        readVariableValue: ['arg1', 'arg2'],
        browse: ['arg 3', 'arg 4']
    };
    actionDispatch(opcClientSession, actions).then((opcData)=>{
        // opcClientSession has been mocked to return what it is given
        expect(opcData).toEqual(actions);
        done();
    });
});

// move all initialization to run before each test
