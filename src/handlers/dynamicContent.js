const fs = require('fs');
const { getMimeType } = require('./staticContent');
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

const serveGuestBook = (request, response) => {
  const templatePath = 'template/guestBook.html';
  const guestBookTemplate = fs.readFileSync(templatePath, 'utf8');
  const comments = readComments('data/guestBook.json');
  const commentsHTML = generateCommentsHTML(comments);
  const updatedBook = guestBookTemplate.replace('_COMMENTS-LIST_', commentsHTML);
  response.setHeader('content-type', getMimeType(templatePath));
  response.send(updatedBook);
  return true;
};

const addComment = ({ queryParams }, response) => {
  const date = new Date().toString();
  const comments = readComments('data/guestBook.json');
  const comment = { ...queryParams, date };
  comments.unshift(comment);
  writeComments('data/guestBook.json', comments);
  response.setHeader('location', '/guest-book');
  response.statusCode = 302;
  response.send('');
  return true;
};

const serveDynamicContent = (request, response) => {
  const { uri } = request;
  console.log('----', request.queryParams);
  if (uri === '/guest-book') {
    return serveGuestBook(request, response);
  }
  if (uri === '/add-comment') {
    console.log(request);
    return addComment(request, response);
  }
  return false;
};

module.exports = { serveDynamicContent };
