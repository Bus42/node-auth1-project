const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('../data/db-config');

const store = new KnexSessionStore({
  tablename: 'sessions',
  sidfieldname: 'sid',
  knex: db,
  createtable: true,
  clearInterval: 60000,
  disableDbCleanup: false,
});

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adequate for production)
  or you can use a session store like `connect-session-knex`.
 */

const server = express();
const middleware = [
  helmet(),
  express.json(),
  cors(),
  session({
    name: 'test session',
    secret: process.env.JWT_SECRET, // even more secret secret
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: process.env.NODE_ENV === 'development',// don't prompt for session cookie if in development mode
    store,
  })
];

server.use(middleware);
server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.use('/*', (req, res) => {
  res.status(404).send({ message: `${req.baseUrl} is not a valid URL` });
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
