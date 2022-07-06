const { loadGuestBook } = require('./app/handlers/loadGuessBook.js');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { notFoundHandler } = require('./app/handlers/notFound.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType.js');
const { router } = require('./server/router.js');
const { routes } = require('./app/routes.js');
const { createRouter } = require('./server/runHandlers.js');
const { parseBodyParams } = require('./app/handlers/parseBodyParams.js');
const { login, injectCookies, injectSession } = require('./app/handlers/loginHandler.js');


const app = (serveFrom, dataFile, sessions) => {
  const handlers = [logRequest, parseBodyParams, injectCookies, injectSession(sessions), setContentType, loadGuestBook(dataFile), serveFileContent(serveFrom), login(sessions), router(routes), notFoundHandler];
  return createRouter(handlers);
};

module.exports = { router: app('./public', './data/guestBook.json', {}) };
