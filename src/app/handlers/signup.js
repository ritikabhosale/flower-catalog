const serveSignupForm = (request, response) => {
  if (request.session) {
    response.redirect("/");
    return;
  }
  response.render("signup");
  return;
};

const signup = (users) => async (request, response) => {
  if (request.session) {
    response.redirect("/");
    return;
  }

  const details = request.body;
  if (await users.doesUserExist(details)) {
    const status = { success: false, message: "User already exists" };
    response.statusCode = 409;
    response.json(status);
    return;
  }

  users.saveUser(details);

  response.redirect("/login");
};

module.exports = { serveSignupForm, signup };
