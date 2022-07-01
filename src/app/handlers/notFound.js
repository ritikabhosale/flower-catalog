const notFoundHandler = (request, response) => {
  response.statusCode = 404;
  response.setHeader('content-type', 'text/html');
  response.end('Page Not Found');
  return;
};

module.exports = { notFoundHandler };
