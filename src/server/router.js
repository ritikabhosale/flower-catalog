class Router {
  #handlers;
  constructor() {
    this.#handlers = [];
  }

  #isHandlerMatching(handler, { method, url }) {
    const matchWith = new RegExp(handler.url);
    return url.pathname.match(matchWith) && method === handler.type;
  }

  #isHelperHandler(handler) {
    return handler.type === 'EVERY';
  }

  #getMatchingHandlers(request) {
    return this.#handlers.filter(handler => {
      return this.#isHelperHandler(handler) || this.#isHandlerMatching(handler, request)
    });
  };

  #createNext([...handlers]) {
    const next = (req, res) => {
      const currentHandler = handlers.shift();
      if (currentHandler) {
        currentHandler.handler(req, res, () => next(req, res));
      }
    };
    return next;
  };

  createRouter() {
    return (req, res) => {
      const handlers = this.#getMatchingHandlers(req)
      const next = this.#createNext(handlers);
      next(req, res);
    };
  };

  every(handler) {
    this.#handlers.push({ handler, type: 'EVERY', url: '/.*' });
  };

  get(url, handler) {
    this.#handlers.push({ handler, type: 'GET', url });
  }

  post(url, handler) {
    this.#handlers.push({ handler, type: 'POST', url });
  }
}

module.exports = { Router };
