const router = routes => (request, response) => {
  let { pathname } = request.url;
  const handler = routes[pathname];
  if (!handler) {
    return false;
  }

  const methodHandler = handler[request.method];
  if (!methodHandler) {
    response.statusCode = 405;
    response.end('Bad method');
    response.setHeader('content-type', 'text/html');
    return true;
  }
  return methodHandler(request, response);
};

module.exports = { router };
