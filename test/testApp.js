const { createApp } = require('../src/app.js');
const request = require('supertest');

describe('/abc', () => {
  const appConfig = { staticDir: './public' };
  it('should route to not found on /abc ', (done) => {
    const req = request(createApp(appConfig));
    req.get('/abc')
      .expect(404, '/abc not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('/', () => {
  const appConfig = { staticDir: './public' };
  it('should send static content', (done) => {
    const req = request(createApp(appConfig));
    req.get('/')
      .expect(200, done)
      .expect('content-type', /html/)
      .expect('content-length', "835")
  });
});
