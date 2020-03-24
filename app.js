const express = require('express'); // nodejs фреймворк
const mongoose = require('mongoose');// сопоставитель документов в базе данных и объектов JavaScript
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const limiter = require('./middlewares/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_LINK, DB_OPTIONS } = require('./constants/config');

const router = require('./routes/');

const app = express();

mongoose.connect(DB_LINK, DB_OPTIONS);

app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
