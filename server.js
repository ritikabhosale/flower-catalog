const { createServer } = require('net');
const { requestHandler } = require('./src/createHandler.js');
const { parseRequest } = require('./src/parseRequest.js');
const { Response } = require('./src/response.js');

const startServer = (PORT, requestHandler) => {
  const server = createServer((socket) => {
    console.log('New connection received');
    socket.on('data', (chunk) => {
      const request = parseRequest(chunk.toString());
      console.log(new Date(), request.method, request.uri);
      const response = new Response(socket);
      requestHandler(request, response);
    });
    socket.on('error', (err) => { });
  });

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
};

startServer(4444, requestHandler);
