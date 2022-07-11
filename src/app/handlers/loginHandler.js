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

const createSession = username => {
  return { username, date: new Date().toLocaleString() };
};

const injectSession = sessions => (request, response, next) => {
  const { sessionId } = request.cookies;
  if (sessionId) {
    request.session = sessions[sessionId];
  }
  next();
  return;
};

const getRegisteredUser = ({ bodyParams: details, usersInfo }) => {
  return usersInfo[details.email];
};

const serveSignUpForm = signUpTemplate => (request, response) => {
  const form = fs.readFileSync(signUpTemplate, 'utf8');
  response.end(form);
};

const signUp = (request, response) => {
  const { name, email, password, mobNo } = request.bodyParams;
  request.usersInfo[email] = { name, email, password, mobNo };
  request.saveUserInfo(request.usersInfo);
  response.setHeader('location', '/login');
  response.statusCode = 302;
  response.end();
  return;
};

const areCredentialsValid = ({ bodyParams, usersInfo }) => {
  const { email, password } = bodyParams;
  return password === usersInfo[email].password;
}

const login = sessions => (request, response) => {
  const user = getRegisteredUser(request);
  const username = user.name;
  if (!user) {
    response.setHeader('location', '/sign-up');
    response.statusCode = 302;
    response.end();
    return;
  }
  if (!areCredentialsValid(request)) {
    response.setHeader('location', '/login');
    response.statusCode = 302;
    response.end();
    return;
  }
  const newId = new Date().getTime();
  response.setHeader('set-cookie', 'sessionId=' + newId);
  const session = createSession(username);
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

const loadUserDetails = detailsFile => {
  const details = JSON.parse(fs.readFileSync(detailsFile, 'utf8'));
  return (request, response, next) => {
    request.usersInfo = details;
    request.saveUserInfo = (details) => {
      fs.writeFileSync(detailsFile, JSON.stringify(details), 'utf8');
    };
    next();
    return;
  }
}

const logout = sessions => (request, response) => {
  const { sessionId } = request.session;
  delete sessions[sessionId];
  delete request.session;
  response.setHeader('location', '/');
  response.setHeader('set-cookie', 'sessionId=0;max-age:0');
  response.statusCode = 302;
  response.end();
  return;
};

module.exports = { login, injectCookies, injectSession, serveLoginForm, loadUserDetails, serveSignUpForm, signUp, logout };
