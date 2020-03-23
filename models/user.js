const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { LOGIN_ERROR, FIELD_EMAIL_ERROR } = require('../constants/constants');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.path('email').validate(validator.isEmail, FIELD_EMAIL_ERROR);
userSchema.statics.findUserByCredentials = function check(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(LOGIN_ERROR));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(LOGIN_ERROR));
          }
          return user;
        });
    });
};

userSchema.methods.omitPrivate = function omitPrivate() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
