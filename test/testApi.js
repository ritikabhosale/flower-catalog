const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockReadFileSync = (expectedFile, content, expectedEncoding) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  };
};

describe('GET /api/comments', () => {
  const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
  const appConfig = { staticDir: './static', guestBookPath: './data/guestBook.json' }
  it('should serve comment api', (done) => {
    const comments = [{ name: 'abc', comment: 'nice page' }];
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync('./data/guestBook.json', JSON.stringify(comments), 'utf8')
    };
    const res = request(createApp(appConfig, sessions, fs, () => { }));
    res.get('/api/comments')
      .set('Cookie', 'sessionId=1')
      .expect('content-type', /json/)
      .expect(200, comments, done);
  });

  it('should serve comment api with filtered records', (done) => {
    const comments = [
      { name: 'abc', comment: 'nice page', id: 1 },
      { name: 'rst', comment: 'nice page', id: 2 }
    ];
    const fs = {
      readFile: () => { },
      readFileSync: mockReadFileSync('./data/guestBook.json', JSON.stringify(comments), 'utf8')
    };
    const res = request(createApp(appConfig, sessions, fs, () => { }));
    res.get('/api/comments?q=filter&name=abc')
      .set('Cookie', 'sessionId=1')
      .expect('content-type', /json/)
      .expect(200, [comments[0]], done);
  });
});
