const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockConsoleLog = (...expectedText) => {
  return (...actualText) => {
    assert.deepEqual(actualText, expectedText);
  }
}

const mockReadFileSync = (expectedFile, content, expectedEncoding) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  };
};

describe('GET /abc', () => {
  it('should route to not found on /abc ', (done) => {
    const appConfig = { staticDir: './public' };
    const mockedConsoleLog = mockConsoleLog('GET', '/abc');
    const req = request(createApp(appConfig, {}, {}, mockedConsoleLog));
    req.get('/abc')
      .expect(404, '/abc not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('GET /', () => {
  it('should send static content', (done) => {
    const appConfig = { staticDir: './public' };
    const mockedConsoleLog = mockConsoleLog('GET', '/');
    const req = request(createApp(appConfig, {}, {}, mockedConsoleLog));
    req.get('/')
      .expect(200, done)
      .expect('content-type', /html/)
      .expect('content-length', "835")
  });
});

describe('GET /login', () => {
  it('should serve login page', (done) => {
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync('./src/app/template/login.html', 'Login Template', 'utf8')
    }
    const appConfig = { staticDir: './public' };
    const req = request(createApp(appConfig, {}, fs, () => { }));
    req.get('/login')
      .expect(200, done)
  });

  it('should redirect to home page when already logged in', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const appConfig = { staticDir: './public' };
    const req = request(createApp(appConfig, sessions, {}, () => { }));
    req.get('/login')
      .set('Cookie', 'sessionId=1')
      .expect(302, done)
  });
});

describe('POST /login', () => {
  const users = {
    'abc@gmail.com': {
      name: "abc",
      email: "abc@gmail.com",
      password: "abc12",
      mobNo: "9878"
    }
  }
  const sessions = { '1': { sessionId: '1', username: 'abc', time: '12' } };
  const appConfig = { staticDir: './public', usersDataPath: './users.json' };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync('./users.json', JSON.stringify(users), 'utf8')
  }

  it('should post the details', (done) => {
    const req = request(createApp(appConfig, sessions, fs, () => { }));
    req.post('/login')
      .send('email=abc@gmail.com&password=abc12')
      .expect(302, done)
      .expect('location', '/guest-book')
  });

  it('should send json in case of invalid username or password', (done) => {
    const req = request(createApp(appConfig, sessions, fs, () => { }));
    const status = { success: false, message: 'Invalid username or password' };
    req.post('/login')
      .send('email=abc@gmail.com&password=abc1')
      .expect(422, JSON.stringify(status), done)
  });

  it('should redirect to home page when logged in', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(appConfig, sessions, {}, () => { }, fs));
    req.post('/login')
      .set('Cookie', ['sessionId=1'])
      .expect(302, done)
      .expect('location', '/')
  });

  it('should send message when mandatory fields are empty', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const status = { success: false, message: 'All fields required' };

    const req = request(createApp(appConfig, sessions, {}, () => { }, fs));
    req.post('/login')
      .expect(400, JSON.stringify(status), done)
  });
});