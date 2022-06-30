const fs = require('fs');
const rowTemplate = '<tr><td>_DATE_</td><td>_NAME_</td><td>_COMMENT_</td></tr>';

const convertToComment = (searchParams) => {
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

const serveGuestBook = (request, response) => {
  const { guestBook } = request;
  const searchParams = convertToComment(request.url.searchParams);

  guestBook.addComment(searchParams);
  request.saveGuestBook(guestBook);

  const bookHTML = generateHTML(guestBook, 'src/app/template/guestBook.html');
  response.setHeader('content-type', 'text/html');
  response.end(bookHTML);
  return true;
};

module.exports = { serveGuestBook };
