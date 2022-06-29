const { loadGuestBook } = require('./handlers/loadGuessBook.js');
const { serveFileContent } = require('./handlers/staticContent.js');
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { logRequest } = require('./handlers/logRequest.js');
const { setContentType } = require('./handlers/setContentType.js');

const handlers = [logRequest, setContentType, loadGuestBook('./data/guestBook.json'), serveFileContent, guestBookHandler, notFoundHandler];

module.exports = { handlers };
