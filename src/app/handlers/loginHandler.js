const createSession = (user) => {
  const time = new Date();
  return {
    sessionId: time.getTime(),
    time,
    userId: user.id,
    userName: user.name,
  };
};

const fieldsAbsent = ({ email, password }) => {
  return !email || !password;
};

const login = (userStore, sessions) => async (request, response) => {
  const { body } = request;
  if (request.session) {
    response.redirect("/");
    return;
  }

  if (fieldsAbsent(request.body)) {
    response.statusCode = 400;
    const status = { success: false, message: "All fields required" };
    response.json(status);
    return;
  }

  if (!(await userStore.authenticate(body))) {
    response.statusCode = 422;
    const status = { success: false, message: "Invalid credentials" };
    response.json(status);
    return;
  }

  const user = await userStore.getUser(body);

  const session = createSession(user);
  response.cookie("sessionId", session.sessionId);
  sessions[session.sessionId] = session;
  response.redirect("/guest-book");
  return;
};

const serveLoginForm = (request, response) => {
  if (request.session) {
    response.redirect("/");
    return;
  }

  response.render("login");
};

module.exports = { login, serveLoginForm };
