const serveSignupForm = (signUpTemplate, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const form = fs.readFileSync(signUpTemplate, 'utf8');
  response.end(form);
  return;
};

const signup = users => (request, response, next) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const { name, email, password, mobNo } = request.body;
  users[email] = { name, email, password, mobNo };
  next();
  return;
};

const saveUserData = (users, userDataPath, fs) => (request, response) => {
  fs.writeFileSync(userDataPath, JSON.stringify(users), 'utf8');
  response.redirect('/login');
  response.end();
  return;
};

module.exports = { serveSignupForm, signup, saveUserData };
