const express = require("express");
const { GuestBook } = require("./app/guestBook.js");
const { logRequest } = require("./app/handlers/logRequest.js");
const {
  serveGuestBook,
  addComment,
  saveGuestBook,
} = require("./app/handlers/guestBookHandler.js");
const { serveComments } = require("./app/handlers/apiHandler.js");
const { injectCookies } = require("./app/handlers/injectCookies.js");
const { injectSession } = require("./app/handlers/injectSession.js");
const {
  signup,
  serveSignupForm,
  saveUserData,
} = require("./app/handlers/signup.js");
const { login, serveLoginForm } = require("./app/handlers/loginHandler.js");
const { logout } = require("./app/handlers/logout.js");
const { notFound } = require("./app/handlers/notFound.js");

const guestBookTemplate = "./src/app/template/guestBook.html";
const loginFormTemplate = "./src/app/template/login.html";
const signupTemplate = "./src/app/template/signup.html";

const getUsers = (filePath, fs) => {
  let users = {};
  try {
    users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {}
  return users;
};

const getGuestBook = (guestBookPath, fs) => {
  let comments = [];
  try {
    comments = JSON.parse(fs.readFileSync(guestBookPath, "utf8"));
  } catch (err) {}
  return new GuestBook(comments);
};

const createApp = (appConfig, sessions, fs, logger) => {
  const { usersDataPath, staticDir, guestBookPath } = appConfig;
  const app = express();
  const users = getUsers(usersDataPath, fs);
  const guestBook = getGuestBook(guestBookPath, fs);

  const parseBodyParams = express.urlencoded({ extended: true });
  app.use(logRequest(logger));
  app.use(parseBodyParams);
  app.use(injectCookies);
  app.use(injectSession(sessions));
  app.set("view engine", "pug");

  app.get("/guest-book", serveGuestBook(guestBook, guestBookTemplate, fs));
  app.post(
    "/guest-book",
    addComment(guestBook),
    saveGuestBook(guestBook, guestBookPath, fs)
  );

  app.get("/api/comments", serveComments(guestBook));

  app.get("/login", serveLoginForm(loginFormTemplate, fs));
  app.post("/login", login(users, sessions));

  app.get("/signup", serveSignupForm(signupTemplate, fs));
  app.post("/signup", signup(users), saveUserData(users, usersDataPath, fs));

  app.get("/logout", logout(sessions));

  app.use(express.static(staticDir));
  app.use(notFound);
  return app;
};

module.exports = { createApp };
