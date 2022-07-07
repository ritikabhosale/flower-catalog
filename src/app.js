const { loadGuestBook } = require('./app/handlers/loadGuessBook.js');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { notFoundHandler } = require('./app/handlers/notFound.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType.js');
const { router } = require('./server/router.js');
const { routes, sessions } = require('./app/routes.js');
const { createRouter } = require('./server/runHandlers.js');
const { parseBodyParams } = require('./app/handlers/parseBodyParams.js');
const { injectCookies, injectSession, loadUserDetails } = require('./app/handlers/loginHandler.js');

const app = (serveFrom, commentsFile, userDetailsFile, sessions) => {
  const handlers = [loadUserDetails(userDetailsFile), logRequest, parseBodyParams, injectCookies, injectSession(sessions), setContentType, loadGuestBook(commentsFile), serveFileContent(serveFrom), router(routes), notFoundHandler];
  return createRouter(handlers);
};

module.exports = { router: app('./public', './data/guestBook.json', './data/userDetails.json', sessions) };
