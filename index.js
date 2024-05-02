const { Pool } = require("pg");
const { createApp } = require("./src/app.js");
const { UserStore } = require("./src/app/repository/users.js");
const { GuestBook } = require("./src/app/repository/guest-book.js");

const pool = new Pool({
  user: "ritikabhosale",
  password: "super-secret",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "postgres",
});

const appConfig = {
  staticDir: "./public",
  userStore: new UserStore(pool),
  guestBook: new GuestBook(pool),
};

const app = createApp(appConfig, {}, console.log);
app.listen(4444, () => console.log("Listening on http://localhost:4444"));
