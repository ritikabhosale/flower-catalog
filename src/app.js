const express = require("express");
const { logRequest } = require("./app/handlers/logRequest.js");
const {
  serveGuestBook,
  addComment,
} = require("./app/handlers/guestBookHandler.js");
const { injectCookies } = require("./app/handlers/injectCookies.js");
const { injectSession } = require("./app/handlers/injectSession.js");
const { signup, serveSignupForm } = require("./app/handlers/signup.js");
const { login, serveLoginForm } = require("./app/handlers/loginHandler.js");
const { logout } = require("./app/handlers/logout.js");
const { notFound } = require("./app/handlers/notFound.js");

const createApp = (appConfig, sessions, logger) => {
  const { staticDir, userStore, guestBook } = appConfig;
  const app = express();

  const parseBodyParams = express.urlencoded({ extended: true });
  app.use(logRequest(logger));
  app.use(parseBodyParams);
  app.use(injectCookies);
  app.use(injectSession(sessions));
  app.set("view engine", "pug");

  app.get("/guest-book", serveGuestBook(guestBook));
  app.post("/comment", addComment(guestBook));

  app.get("/login", serveLoginForm);
  app.post("/login", login(userStore, sessions));

  app.get("/sign-up", serveSignupForm);
  app.post("/sign-up", signup(userStore));

  app.get("/logout", logout(sessions));

  app.use(express.static(staticDir));
  app.use(notFound);
  return app;
};

module.exports = { createApp };
