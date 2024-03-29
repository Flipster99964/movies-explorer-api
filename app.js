require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const {
  PORT = 3000,
  MONGO_LINK = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rateLimiter');
const router = require('./routes');

const allowedCors = require('./utils/constants');

const app = express();

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());

app.use(cors({
  origin: allowedCors,
}));


mongoose.connect(MONGO_LINK);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
}) 