const serveGuestBook = (request, response) => {
  const { queryParams, guestBook } = request;

  guestBook.addComment(queryParams);
  request.saveGuestBook(guestBook);

  const bookHTML = guestBook.generateHTML();
  response.setHeader('content-type', 'text/html');
  response.send(bookHTML);
  return true;
};

const guestBookHandler = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    return serveGuestBook(request, response);
  }
  return false;
};

module.exports = { guestBookHandler };
