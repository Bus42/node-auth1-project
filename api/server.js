require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const session = require('express-session');
const Store = require('connect-session-knex')(session);
const knex = require('../data/db-config');

const server = express();

const middleware = [
  helmet(),
  express.json(),
  cors(),
  morgan("dev")
];

server.use(session({
  name: "chocolatechip",
  secret: process.env.SESSION_SECRET || "NO SECRET",
  saveUninitialized: process.env.NODE_ENV !== "production",
  resave: false,
  store: new Store({
    knex,
    createTable: true,
    clearInterval: 1000 * 60 * 10,
    tablename: "sessions",
    sidfieldname: "sid",
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  }
}));

server.use(middleware);

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.use('/', (req, res) => {
  res.status(200).send({ message: "api up" });
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
