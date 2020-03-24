require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT || 2000;
const JWT_SECRET = isProduction ? process.env.JWT_SECRET : 'dev-secret';

const DB_LINK = isProduction ? process.env.DB_LINK : 'mongodb://localhost:27017/newsdb';
const DB_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  PORT,
  DB_LINK,
  DB_OPTIONS,
  JWT_SECRET,
};
