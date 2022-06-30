const { loadGuestBook } = require('./handlers/loadGuessBook.js');
const { serveFileContent } = require('./handlers/staticContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { logRequest } = require('./handlers/logRequest.js');
const { setContentType } = require('./handlers/setContentType.js');
const { routes, router } = require('./router.js');

const app = (routes, serveFrom) => {
  const handlers = [logRequest, setContentType, loadGuestBook('./data/guestBook.json'), serveFileContent(serveFrom), router(routes), notFoundHandler];
  return handlers;
};

module.exports = { handlers: app(routes, './public') };
