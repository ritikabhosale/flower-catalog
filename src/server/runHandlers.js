const createNext = ([...handlers]) => {
  const next = (req, res) => {
    const currentHandler = handlers.shift();
    if (currentHandler) {
      currentHandler(req, res, () => next(req, res));
    }
  };
  return next;
};

const createRouter = (handlers) => {
  return (req, res) => {
    const next = createNext(handlers);
    next(req, res);
  };
};

module.exports = { createRouter };
