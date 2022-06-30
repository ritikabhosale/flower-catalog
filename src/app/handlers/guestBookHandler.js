const fs = require('fs');
const rowTemplate = '<tr><td>_DATE_</td><td>_NAME_</td><td>_COMMENT_</td></tr>';

const toSearchParams = (searchParams) => {
  let entries = {};
  for (const [key, value] of searchParams.entries()) {
    entries[key] = value;
  }
  return entries;
};

const commentHTML = ({ name, comment, date }) => {
  return rowTemplate.replace('_DATE_', date).replace('_NAME_', name).replace('_COMMENT_', comment);
};

const generateCommentsHTML = (comments) => {
  let commentsHTML = '';
  comments.forEach(comment => {
    commentsHTML += commentHTML(comment)
  });
  return commentsHTML;
};

const read = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const generateHTML = (guestBook, template) => {
  const commentsJSON = guestBook.toString();
  const comments = JSON.parse(commentsJSON);
  const templateString = read(template);
  const commentsHTML = generateCommentsHTML(comments);
  return templateString.replace('_COMMENTS-LIST_', commentsHTML);
};

const addComment = (request, response) => {
  const { guestBook } = request;
  const searchParams = toSearchParams(request.url.searchParams);
  guestBook.addComment(searchParams);
  request.saveGuestBook(guestBook);
  response.statusCode = 302;
  response.setHeader('location', '/guest-book');
  response.end();
  return true;
};

const serveGuestBook = templatePath => (request, response) => {
  const { guestBook } = request;
  const bookHTML = generateHTML(guestBook, templatePath);
  response.setHeader('content-type', 'text/html');
  response.end(bookHTML);
  return true;
};

module.exports = { serveGuestBook, addComment, toSearchParams };
