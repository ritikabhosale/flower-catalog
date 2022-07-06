const login = (request, response, next) => {
  response.end('Received request');
  response.setHeader('set-cookie', 'sessionId:1');
  return;
};

module.exports = { login };
