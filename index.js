const { requestHandler } = require('./src/server/createHandler');
const { startServer } = require('./src/server/server');

startServer(4444, requestHandler);
