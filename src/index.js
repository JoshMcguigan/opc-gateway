const app = require('./app');

const opcEndpointUrl = process.argv[2];
const port = process.argv[3];

if (opcEndpointUrl && port){
    console.log(`endpoint = ${opcEndpointUrl}  ///  port = ${port}`);
    app(opcEndpointUrl, port);
} else {
    console.log("Error launching opc-gateway. Ensure you included OPC end point url and gateway port number.");
}
