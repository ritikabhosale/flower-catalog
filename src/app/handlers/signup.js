const fs = require('fs');

const serveSignUpForm = signUpTemplate => (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const form = fs.readFileSync(signUpTemplate, 'utf8');
  response.end(form);
};

const signUp = (request, response) => {
  if (request.session) {
    response.redirect('/');
    response.end();
    return;
  };
  const { name, email, password, mobNo } = request.body;
  request.usersInfo[email] = { name, email, password, mobNo };
  request.saveUserInfo(request.usersInfo);
  response.redirect('/login');
  response.end();
  return;
};

module.exports = { serveSignUpForm, signUp };
