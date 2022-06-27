const fs = require('fs');
const { getMimeType } = require('./staticContent');

const generateCommentsHTML = (comments) => {
  let commentsHTML = '';
  comments.forEach(({ name, comment, date }) => {
    commentsHTML += `${date} | ${name} | ${comment} <br/>`;
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
  const updatedBook = guestBookTemplate.replace('_COMMENTS_', commentsHTML);
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
  response.statusCode = 301;
  response.send('');
  return true;
};

const serveDynamicContent = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    return serveGuestBook(request, response);
  }
  if (uri === '/add-comment') {
    return addComment(request, response);
  }
  return false;
};

module.exports = { serveDynamicContent };
