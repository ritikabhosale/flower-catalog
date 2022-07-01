const { toSearchParams } = require('./guestBookHandler.js');

const parseBodyParams = (request, response, next) => {
  let body = '';
  if (request.method === 'POST') {
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      const bodyParams = toSearchParams(new URLSearchParams(body));
      request.bodyParams = bodyParams;
      next();
    });
  }
  else {
    next();
  }
};

module.exports = { parseBodyParams };
