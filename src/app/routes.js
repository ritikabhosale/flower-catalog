const { serveGuestBook, addComment } = require('./handlers/guestBookHandler.js');
const { serveComments } = require('./handlers/apiHandler.js');
const dataFile = './data/guestBook.json';
const guestBookTemplate = './src/app/template/guestBook.html';

const routes = {
  '/guest-book': {
    GET: serveGuestBook(guestBookTemplate),
  },
  '/add-comment': {
    GET: addComment
  },
  '/api/comments': {
    GET: serveComments(dataFile)
  }
};

module.exports = { routes };
