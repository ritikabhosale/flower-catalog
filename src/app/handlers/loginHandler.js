const fs = require('fs');

const parseCookies = cookiesAsString => {
  const cookies = {};
  if (cookiesAsString) {
    cookiesAsString.split(';').forEach(cookieAsString => {
      const [name, value] = cookieAsString.split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

const injectCookies = (request, response, next) => {
  const cookiesAsString = request.headers.cookie;
  const cookies = parseCookies(cookiesAsString);
  request.cookies = cookies;
  next();
};

const createSession = sessionId => {
  return { sessionId, date: new Date().toLocaleString() };
};

const injectSession = (request, response, next) => {
  const { sessionId } = request.cookies;
  if (sessionId) {
    request.session = sessionId;
  }
  next();
  return;
};

const login = sessions => (request, response) => {
  const newId = new Date().getTime();
  response.setHeader('set-cookie', 'sessionId=' + newId);
  const session = createSession(newId);
  sessions[newId] = session;
  response.setHeader('location', '/guest-book');
  response.statusCode = 302;
  response.end();
  return;
};

const serveLoginForm = formTemplate => (request, response) => {
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};

module.exports = { login, injectCookies, injectSession, serveLoginForm };
