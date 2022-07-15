const { createApp } = require('./src/app.js');
const appConfig = {
  staticDir: './public',
  usersDataPath: './data/userDetails.json',
  guestBookPath: './data/guestBook.json'
};

const fs = require('fs');
const app = createApp(appConfig, {}, fs, console.log);
app.listen(4444, () => console.log('Listening on http://localhost:4444'));
