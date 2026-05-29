const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');

const authenticate = require('./auth');
const { createErrorResponse } = require('./response');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

const app = express();

app.use(pino);
app.use(helmet());
app.use(cors());

// Parse plain text request bodies for POST /v1/fragments
// app.use(express.text({ type: 'text/plain' }));

// Set up Passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());

// Use routes
app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json(createErrorResponse(status, message));
});

module.exports = app;