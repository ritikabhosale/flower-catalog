const { Pool } = require("pg");
const { createApp } = require("./src/app.js");
const { UserStore } = require("./src/app/repository/users.js");
const { GuestBook } = require("./src/app/repository/guest-book.js");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
});

const appConfig = {
  staticDir: "./public",
  userStore: new UserStore(pool),
  guestBook: new GuestBook(pool),
};

const port = process.env.PORT || 4444;

const app = createApp(appConfig, {}, console.log);
app.listen(port, () => console.log("Listening on http://localhost:4444"));
