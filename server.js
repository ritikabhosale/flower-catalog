const { createServer } = require('net');
const { parseRequest } = require('./src/parseRequest.js');
const { Response } = require('./src/response.js');

const startServer = (PORT) => {
  const server = createServer((socket) => {
    console.log('New connection received');
    socket.on('data', (chunk) => {
      const request = parseRequest(chunk.toString());
      console.log(new Date(), request.method, request.uri);
      const response = new Response(socket);
      response.send('Response received successfully');
    });
    socket.on('error', (err) => { });
  });

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
};

startServer(4444);
