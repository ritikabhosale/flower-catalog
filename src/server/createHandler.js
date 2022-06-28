const { serveFileContent } = require('../app/handlers/staticContent.js');
const { guestBookHandler } = require('../app/handlers/guestBookHandler.js');
const { notFoundHandler } = require('../app/handlers/notFound.js');
const { loadGuestBook } = require('../app/handlers/loadGuessBook.js');

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
