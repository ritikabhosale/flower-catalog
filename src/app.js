const { loadGuestBook } = require('./app/handlers/loadGuessBook.js');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { notFoundHandler } = require('./app/handlers/notFound.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType.js');
const { router } = require('./server/router.js');
const { routes } = require('./app/routes.js');
const { createHandler } = require('./server/runHandlers.js');

const app = (serveFrom, dataFile) => {
  const handlers = [logRequest, setContentType, loadGuestBook(dataFile), serveFileContent(serveFrom), router(routes), notFoundHandler];
  return createHandler(handlers);
};

module.exports = { handlers: app('./public', './data/guestBook.json') };
