const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants/config');
const { UNAUTHORIZED } = require('../constants/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(UNAUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED);
  }

  req.user = payload;

  next();
};
