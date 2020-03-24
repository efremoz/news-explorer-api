const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const UnathorizedError = require('../errors/UnauthorizedError');

const { NOT_FOUND_USER_ERROR, AUTH_TEXT, LOGIN_ERROR } = require('../constants/constants');
const { JWT_SECRET } = require('../constants/config');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const { password: pass, ...newUser } = user._doc;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(err.message));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: AUTH_TEXT })
        .end();
    })
    .catch((err) => {
      if (err.message !== LOGIN_ERROR) {
        next(err);
      }
      next(new UnathorizedError(err.message));
    });
};

const getUser = (req, res, next) => User
  .findOne({ _id: req.user._id })
  .then((userId) => {
    if (!userId) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }

    res.send(userId);
  })
  .catch(next);


module.exports = {
  getUser,
  createUser,
  login,
};
