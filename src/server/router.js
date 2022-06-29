const { handlers } = require('../app/app.js');

const createHandler = (handlers) => {
  return (request, response) => {
    for (const handler of handlers) {
      if (handler(request, response)) {
        return true;
      }
    }
    return false;
  }
};

module.exports = { requestHandler: createHandler(handlers) };
