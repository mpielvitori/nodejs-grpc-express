const PROTO_PATH = `${__dirname}/proto/hello.proto`;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);
const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld;

const app = express();
const port = 3000;
function main() {
  const client = new helloProto.Greeter(
    'grpc-server:50051', grpc.credentials.createInsecure(),
  );
  app.get('/:name', (req, res) => {
    client.sayHello({ name: req.params.name }, (err, response) => {
      console.log('Greeting:', response.message);
      res.send(response.message);
    });
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
main();
