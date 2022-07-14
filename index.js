const { createApp } = require('./src/app.js');
const appConfig = { staticDir: './public' };

const app = createApp(appConfig, {});
app.listen(4444, () => console.log('Listening on http://localhost:4444'));
