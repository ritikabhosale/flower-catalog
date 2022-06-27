const { serveFileContent } = require('./handlers/staticContent.js');
const { serveDynamicContent } = require('./handlers/dynamicContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');

const createHandler = (handlers) => {
  return (request, response) => {
    for (const handler of handlers) {
      if (handler(request, response)) {
        return true;
      }
    }
    return false;
  }
};

const handlers = [serveFileContent, serveDynamicContent, notFoundHandler];
module.exports = { requestHandler: createHandler(handlers) };
