const router = require('express').Router();

const users = require('./users');
const articles = require('./articles');

const { NOT_FOUND_ERROR } = require('../constants/constants');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', users);
router.use('/articles', articles);
router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR));
});

module.exports = router;
