const logRequest = (request, response, next) => {
  console.log(request.method, request.url);
  next();
};

module.exports = { logRequest };
