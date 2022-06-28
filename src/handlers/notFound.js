const notFoundHandler = (request, response) => {
  response.statusCode = 404;
  response.setHeader('content-type', 'text/html');
  response.send('Page Not Found');
};

module.exports = { notFoundHandler };
