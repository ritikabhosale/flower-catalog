const convertToComment = (searchParams) => {
  let entries = {};
  for (const [key, value] of searchParams.entries()) {
    entries[key] = value;
  }
  return entries;
};

const serveGuestBook = (request, response) => {
  const { guestBook } = request;
  const searchParams = convertToComment(request.url.searchParams);

  guestBook.addComment(searchParams);
  request.saveGuestBook(guestBook);

  const bookHTML = guestBook.generateHTML();
  response.setHeader('content-type', 'text/html');
  response.end(bookHTML);
  return true;
};

const guestBookHandler = (request, response) => {
  const { pathname } = request.url;
  if (pathname === '/guest-book') {
    return serveGuestBook(request, response);
  }
  return false;
};

module.exports = { guestBookHandler };
