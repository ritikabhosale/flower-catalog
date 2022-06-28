const { serveFileContent } = require('./handlers/staticContent.js');
const { serveDynamicContent } = require('./handlers/dynamicContent.js');
const { notFoundHandler } = require('./handlers/notFound.js');
const { GuestBook } = require('./guestBook.js');
const fs = require('fs');

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

const readComments = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

const writeComments = (fileName, comments) => {
  fs.writeFileSync(fileName, JSON.stringify(comments), 'utf8');
};

const loadGuestBook = (guestBookName) => {
  const comments = readComments(guestBookName);
  const guestBook = new GuestBook(comments, 'template/guestBook.html');
  return (request, response) => {
    request.guestBook = guestBook;
    request.saveGuestBook = (guestBook) => {
      writeComments(guestBookName, guestBook.getComments());
    }
  };
};

const handlers = [loadGuestBook('./data/guestBook.json'), serveFileContent, serveDynamicContent, notFoundHandler];
module.exports = { requestHandler: createHandler(handlers) };
