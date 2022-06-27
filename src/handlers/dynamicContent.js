const fs = require('fs');
const rowTemplate = '<tr><td>_DATE_</td><td>_NAME_</td><td>_COMMENT_</td></tr>';

const generateCommentsHTML = (comments) => {
  let commentsHTML = '';
  comments.forEach(({ name, comment, date }) => {
    commentsHTML += rowTemplate.replace('_DATE_', date).replace('_NAME_', name).replace('_COMMENT_', comment);
  });
  return commentsHTML;
};

const readComments = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'))
};

const writeComments = (fileName, comments) => {
  fs.writeFileSync(fileName, JSON.stringify(comments), 'utf8');
};

const addComment = (fileName, { name, comment }) => {
  const comments = readComments(fileName);
  if (!name || !comment) {
    return comments;
  }
  const date = new Date().toString();
  comments.unshift({ name, comment, date });
  return comments;
};

const updateGuestBook = (book, comments) => {
  const commentsHTML = generateCommentsHTML(comments);
  const guestBookTemplate = fs.readFileSync(book, 'utf8');
  return guestBookTemplate.replace('_COMMENTS-LIST_', commentsHTML);
};

const serveGuestBook = ({ queryParams }, response) => {
  const updatedComments = addComment('data/guestBook.json', queryParams);
  writeComments('data/guestBook.json', updatedComments);
  const bookHTML = updateGuestBook('template/guestBook.html', updatedComments);
  response.setHeader('content-type', 'text/html');
  response.send(bookHTML);
  return true;
};

const serveDynamicContent = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    return serveGuestBook(request, response);
  }
  return false;
};

module.exports = { serveDynamicContent };
