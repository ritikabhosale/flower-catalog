const fs = require('fs');
const rowTemplate = '<tr id=_ID_><td>_DATE_</td><td>_NAME_</td><td>_COMMENT_</td></tr>';

const commentHTML = ({ id, name, comment, date }) => {
  return rowTemplate.replace('_ID_', id).replace('_DATE_', date).replace('_NAME_', name).replace('_COMMENT_', comment);
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

const generateHTML = ({ guestBook, session }, template) => {
  const commentsJSON = guestBook.toString();
  const comments = JSON.parse(commentsJSON);
  const templateString = read(template);
  const commentsHTML = generateCommentsHTML(comments);
  return templateString.replace('_COMMENTS-LIST_', commentsHTML).replace('_USERNAME_', session.username);
};

const addComment = (request, response, next) => {
  const { guestBook, body } = request;
  body.name = request.session.username;
  guestBook.addComment(body);
  request.saveGuestBook(guestBook);
  response.end();
  return;
};

const serveGuestBook = templatePath => (request, response, next) => {
  if (!request.session) {
    response.redirect('/login');
    response.end();
    return;
  }
  const bookHTML = generateHTML(request, templatePath);
  console.log('hello`');
  response.setHeader('content-type', 'text/html');
  response.end(bookHTML);
  return;
};

module.exports = { serveGuestBook, addComment };
