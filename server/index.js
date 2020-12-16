const PROTO_PATH = `${__dirname}/proto/hello.proto`;
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

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
function sayHello(call, callback) {
  callback(null, { message: `Hello ${call.request.name}` });
}
function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { sayHello });
  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (!err) {
        console.error(err);
      }
      server.start();
      console.log(`Server running at ${port}`);
    },
  );
}
main();
