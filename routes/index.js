const router = require('express').Router();

const { createUser, login } = require('../controllers/users');

const users = require('./users');
const cards = require('./articles');
const auth = require('../middlewares/auth');
const { signupCheck, loginCheck } = require('../modules/validations');

const { NOT_FOUND_ERROR } = require('../constants/constants');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', loginCheck, login);
router.post('/signup', signupCheck, createUser);

// мидлвеар который контролирует область доступа для юзера
router.use(auth);

router.use('/users', users);
router.use('/articles', cards);
router.use((req, res, next) => next(new NotFoundError(NOT_FOUND_ERROR)));

module.exports = router;
