const { handlers } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

startServer(4444, handlers);
