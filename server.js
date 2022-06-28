const http = require('http');
const { requestHandler } = require('./src/createHandler.js');

const startServer = (PORT, handler) => {
  const server = http.createServer((request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    request.url = url;
    handler(request, response);
  });

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${server.address().port}`);
  });
};

startServer(4444, requestHandler);
