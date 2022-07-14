const fs = require('fs');

const createSession = username => {
  return { username, date: new Date().toLocaleString() };
};

const getRegisteredUser = ({ body, usersInfo }) => {
  return usersInfo[body.email];
};

const areCredentialsValid = ({ body, usersInfo }) => {
  const { email, password } = body;
  return password === usersInfo[email].password;
}

const login = sessions => (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };

  const user = getRegisteredUser(request);
  if (!user) {
    response.redirect('/sign-up');
    response.end();
    return;
  }
  if (!areCredentialsValid(request)) {
    response.redirect('/login');
    response.end();
    return;
  }
  const newId = new Date().getTime();
  response.cookie('sessionId', newId);
  const session = createSession(user.name);
  sessions[newId] = session;
  response.redirect('/guest-book');
  response.end();
  return;
};

const serveLoginForm = formTemplate => (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};

module.exports = { login, serveLoginForm };
