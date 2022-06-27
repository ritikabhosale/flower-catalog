const fs = require('fs');
const { getMimeType } = require('./staticContent');

const generateCommentsHTML = (comments) => {
  let commentsHTML = '';
  comments.forEach(({ name, comment, date }) => {
    console.log(name, comment, date);
    commentsHTML += `${date} | ${name} | ${comment} <br/>`;
  });
  return commentsHTML;
};

const serveGuestBook = (request, response) => {
  const templatePath = 'template/guestBook.html';
  const guestBookTemplate = fs.readFileSync(templatePath, 'utf8');
  const comments = JSON.parse(fs.readFileSync('data/comments.json', 'utf8'));
  const commentsHTML = generateCommentsHTML(comments);
  const updatedBook = guestBookTemplate.replace('_COMMENTS_', commentsHTML);
  console.log(updatedBook);
  response.setHeader('content-type', getMimeType(templatePath));
  response.send(updatedBook);
  return true;
};

const addComment = ({ queryParams }, response) => {
  const date = new Date().toString();
  const comments = JSON.parse(fs.readFileSync('data/comments.json', 'utf8'));
  const comment = { ...queryParams, date };
  comments.unshift(comment);
  fs.writeFileSync('data/comments.json', JSON.stringify(comments), 'utf8');
  response.setHeader('location', 'guest-book');
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
