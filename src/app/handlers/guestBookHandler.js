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

const addComment = (request, response, next) => {
  const { guestBook, bodyParams } = request;
  const comment = guestBook.addComment(bodyParams);
  request.saveGuestBook(guestBook);
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(comment));
  return;
};

const serveGuestBook = templatePath => (request, response, next) => {
  if (!request.session) {
    response.setHeader('location', '/login');
    response.statusCode = 302;
    response.end();
    return;
  }
  const { guestBook } = request;
  const bookHTML = generateHTML(guestBook, templatePath);
  response.setHeader('content-type', 'text/html');
  response.end(bookHTML);
  return;
};

module.exports = { serveGuestBook, addComment, toSearchParams };
