const { requestHandler } = require('./src/server/router.js');
const { startServer } = require('./src/server/server.js');

startServer(4444, requestHandler);
