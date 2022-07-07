const { serveGuestBook, addComment } = require('./handlers/guestBookHandler.js');
const { serveComments } = require('./handlers/apiHandler.js');
const { login, serveLoginForm, signUp, serveSignUpForm } = require('./handlers/loginHandler.js');
const dataFile = './data/guestBook.json';
const guestBookTemplate = './src/app/template/guestBook.html';
const loginFormTemplate = './src/app/template/login.html';
const singUpTemplate = './src/app/template/signup.html';
const sessions = {};

const routes = {
  '/guest-book': {
    GET: serveGuestBook(guestBookTemplate),
  },
  '/add-comment': {
    POST: addComment
  },
  '/api/comments': {
    GET: serveComments(dataFile)
  },
  '/login': {
    GET: serveLoginForm(loginFormTemplate),
    POST: login(sessions)
  },
  '/sign-up': {
    GET: serveSignUpForm(singUpTemplate),
    POST: signUp
  }
};

module.exports = { routes, sessions };
