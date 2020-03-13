const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const { LOGIN_ERROR, FIELD_EMAIL_ERROR } = require('../constants/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: FIELD_EMAIL_ERROR,
  }),
];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.statics.findUserByCredentials = (email, password) => this.findOne({ email })
  .select('+password')
  .then((user) => {
    if (!user) {
      return Promise.reject(
        new UnauthorizedError(LOGIN_ERROR),
      );
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(
          new UnauthorizedError(LOGIN_ERROR),
        );
      }

      return user;
    });
  });

module.exports = mongoose.model('user', userSchema);
