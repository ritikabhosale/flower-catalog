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

const generateHTML = (guestBook, username, templateString) => {
  const commentsJSON = guestBook.toJSON();
  const comments = JSON.parse(commentsJSON);
  const commentsHTML = generateCommentsHTML(comments);
  return templateString.replace('_COMMENTS-LIST_', commentsHTML).replace('_USERNAME_', username);
};

const saveGuestBook = (guestBook, guestBookPath, fs) => (request, response) => {
  fs.writeFileSync(guestBookPath, guestBook.toJSON(), 'utf8');
  response.end();
  return;
};

const addComment = guestBook => (request, response, next) => {
  const { body, session } = request;
  body.name = session.username;
  guestBook.addComment(body);
  next();
  return;
};

const serveGuestBook = (guestBook, template, fs) => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    response.end();
    return;
  }
  const { username } = request.session;
  const templateString = fs.readFileSync(template, 'utf8');
  const bookHTML = generateHTML(guestBook, username, templateString);
  response.end(bookHTML);
  return;
};

module.exports = { serveGuestBook, addComment, saveGuestBook };
