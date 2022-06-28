const fs = require('fs');
const { GuestBook } = require('../guestBook');

const readComments = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

const writeComments = (fileName, comments) => {
  fs.writeFileSync(fileName, JSON.stringify(comments), 'utf8');
};

const loadGuestBook = (guestBookName) => {
  const comments = readComments(guestBookName);
  const guestBook = new GuestBook(comments, 'src/app/template/guestBook.html');
  return (request, response) => {
    request.guestBook = guestBook;
    request.saveGuestBook = (guestBook) => {
      writeComments(guestBookName, guestBook.getComments());
    }
  };
};

module.exports = { loadGuestBook };
