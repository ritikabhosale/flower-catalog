const serveSignupForm = (signUpTemplate, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    return;
  };
  const form = fs.readFileSync(signUpTemplate, 'utf8');
  response.end(form);
  return;
};

const userExists = (users, { email }) => {
  return users[email] ? true : false;
}

const signup = users => (request, response, next) => {
  if (request.session) {
    response.redirect('/');
    return;
  };
  const details = request.body;
  if (userExists(users, details)) {
    const status = { success: false, message: 'User already exists' };
    response.statusCode = 409;
    response.json(status);
    return;
  }

  users[details.email] = details;
  next();
  return;
};

const saveUserData = (users, userDataPath, fs) => (request, response) => {
  fs.writeFileSync(userDataPath, JSON.stringify(users), 'utf8');
  const status = { success: true, message: 'Sign-up Successful' };
  response.json(status);
  return;
};

module.exports = { serveSignupForm, signup, saveUserData };
