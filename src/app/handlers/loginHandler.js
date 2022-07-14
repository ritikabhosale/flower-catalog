const createSession = username => {
  return { username, date: new Date().toLocaleString() };
};

const getRegisteredUser = (body, users) => {
  return users[body.email];
};

const areCredentialsValid = (body, users) => {
  const { email, password } = body;
  return password === users[email].password;
}

const login = (users, sessions) => (request, response) => {
  const { body } = request;
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };

  const user = getRegisteredUser(body, users);

  if (!user) {
    response.redirect('/sign-up');
    response.end();
    return;
  }

  if (!areCredentialsValid(body, users)) {
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

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};

module.exports = { login, serveLoginForm };
