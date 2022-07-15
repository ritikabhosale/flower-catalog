const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockReadFileSync = (expected, expectedEncoding) => {
  let index = 0;
  return (fileName, encoding) => {
    const { content, file } = expected[index];
    assert.strictEqual(fileName, file);
    assert.strictEqual(encoding, expectedEncoding);
    index++;
    return content;
  };
};

const mockWriteFileSync = (expectedFile, expectedContent, expectedEncoding) => {
  return (fileName, content, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    assert.deepStrictEqual(content, expectedContent);
    return content;
  };
};

describe('GET /guest-book', () => {
  it('should serve guest book', (done) => {
    const appConfig = { staticDir: './static', guestBookPath: './hello' };
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync(
        [{ file: './hello', content: 'hello' },
        { file: './src/app/template/guestBook.html', content: 'guestBook' }],
        'utf8')
    };
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(appConfig, sessions, fs, () => { }));
    req.get('/guest-book')
      .set('cookie', 'sessionId=1')
      .expect(200, done)
  });

  it('should redirect to home page', (done) => {
    const appConfig = { staticDir: './static', guestBookPath: './hello' };
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync(
        [{ file: './hello', content: 'hello' },
        { file: './src/app/template/guestBook.html', content: 'guestBook' }],
        'utf8')
    };
    const req = request(createApp(appConfig, {}, fs, () => { }));
    req.get('/guest-book')
      .expect('location', '/login')
      .expect(302, done)
  });
});

describe('POST /guest-book', () => {
  it('should redirect to home page', (done) => {
    const appConfig = { staticDir: './static', guestBookPath: './hello' };
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync(
        [{ file: './hello', content: 'hello' },
        { file: './src/app/template/guestBook.html', content: 'guestBook' }],
        'utf8')
    };
    const req = request(createApp(appConfig, {}, fs, () => { }));
    req.post('/guest-book')
      .expect('location', '/login')
      .send('name=abc&comment=something')
      .expect(302, done)
  });
});
