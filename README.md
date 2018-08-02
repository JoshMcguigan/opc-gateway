# opc-gateway

OPC Gateway exposes data from an OPC-UA server via HTTP and WebSocket APIs.

## Support

This package is no longer actively maintained.

## Run

OPC Gateway is launched from the command line with two arguments: the URL of the OPC server and the port number to use for the web server.

```
npm start opc.tcp://localhost:26543 3000
```

## Use

```
// POST this to /api (HTTP)
// or send it to /api (WebSockets)
{
	"readVariableValue":"ns=1;s=FanSpeed",
	"browse": "RootFolder"
}
// Receive this
{
    "readVariableValue": {
        "value": {
            "dataType": "Double",
            "arrayType": "Scalar",
            "value": 972.941836492203
        },
        "statusCode": {
            "value": 0,
            "description": "No Error",
            "name": "Good"
        },
        "sourcePicoseconds": 0,
        "serverPicoseconds": 0
    },
    "browse": [
        {
            "statusCode": {
                "value": 0,
                "description": "No Error",
                "name": "Good"
            },
            "references": [
                {
                    "referenceTypeId": "ns=0;i=40",
                    "isForward": true,
                    "nodeId": "ns=0;i=61",
                    "browseName": {
                        "namespaceIndex": 0,
                        "name": "FolderType"
                    },
                    "displayName": {
                        "text": "FolderType"
                    },
                    "nodeClass": "ObjectType",
                    "typeDefinition": "ns=0;i=0"
                },
                {
                    "referenceTypeId": "ns=0;i=35",
                    "isForward": true,
                    "nodeId": "ns=0;i=85",
                    "browseName": {
                        "namespaceIndex": 0,
                        "name": "Objects"
                    },
                    "displayName": {
                        "text": "Objects"
                    },
                    "nodeClass": "Object",
                    "typeDefinition": "ns=0;i=61"
                }
            ]
        }
    ]
}

```

## Test

```
// Run the unit tests
npm test

// Run the integration tests
npm run test:mockopc
npm run test:mockapp
npm run test:integration
```

## Troubleshooting

If you get errors related to certificates when starting opc-gateway or running the tests, there is likely a conflict between the version of openssl on your machine and what is required by the `node-opcua` version used by opc-gateway. The specifics for fixing this will depend on the setup of your machine, but [this](https://github.com/node-opcua/node-opcua/issues?utf8=%E2%9C%93&q=is%3Aissue+certificate) would be a good starting point. 
