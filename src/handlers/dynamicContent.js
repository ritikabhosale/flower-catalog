const fs = require('fs');
const { getMimeType } = require('./staticContent');

const serveGuestBook = (request, response) => {
  const guestBookTemplate = fs.readFileSync('template/guestBook.html', 'utf8');
  response.setHeader('content-type', 'text/html');
  response.send(guestBookTemplate);
};

const serveDynamicContent = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    return serveGuestBook(request, response);
  }
  return false;
};

module.exports = { serveDynamicContent };
