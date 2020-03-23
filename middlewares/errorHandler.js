const { SERVER_ERROR } = require('../constants/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = (err.name === 'ValidationError' ? 400 : 500), message = SERVER_ERROR } = err;
  res.status(statusCode).send({ message });

  next();
};

module.exports = {
  errorHandler,
};
