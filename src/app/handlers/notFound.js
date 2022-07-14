const notFound = (request, response) => {
  response.type('text/plain');
  response.status(404).end(`${request.url} not Found`)
  return;
};

module.exports = { notFound };
