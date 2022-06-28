const { serveFileContent } = require('./handlers/staticContent.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { loadGuestBook } = require('./loadGuessBook.js');

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

const handlers = [loadGuestBook('./data/guestBook.json'), serveFileContent, guestBookHandler, notFoundHandler];
module.exports = { requestHandler: createHandler(handlers) };
