const { createApp } = require('../src/app.js');
const request = require('supertest');

describe('GET /logout', () => {
  const appConfig = { staticDir: '/public' };
  const fs = {
    readFile: () => { },
    readFileSync: () => { },
  };

  it('should send setCookie header with maxage 0.', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(appConfig, sessions, {}, () => { }, fs));
    req.get('/logout')
      .set('Cookie', ['sessionId=1'])
      .expect(302, done)
      .expect('set-cookie', 'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  });
});
