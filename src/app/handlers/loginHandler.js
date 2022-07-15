const createSession = username => {
  const time = new Date();
  return { sessionId: time.getTime(), time, username };
};

const getUser = (body, users) => {
  return users[body.email];
};

const authenticateUser = (users, userDetails) => {
  const user = users[userDetails.email];
  if (user) {
    return user.password === userDetails.password;
  }
  return false;
};

const fieldsAbsent = ({ email, password }) => {
  return !email || !password;
};

const login = (users, sessions) => (request, response) => {
  const { body } = request;
  if (request.session) {
    response.redirect('/');
    return;
  };

  if (fieldsAbsent(request.body)) {
    response.statusCode = 400;
    const status = { success: false, message: 'All fields required' };
    response.json(status);
    return;
  }

  if (!authenticateUser(users, body)) {
    response.statusCode = 422;
    const status = { success: false, message: 'Invalid username or password' };
    response.json(status);
    return;
  }

  const session = createSession(getUser(body, users).name);
  response.cookie('sessionId', session.sessionId);
  sessions[session.sessionId] = session;
  response.redirect('/guest-book');
  return;
};

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    return;
  };
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};

module.exports = { login, serveLoginForm };
