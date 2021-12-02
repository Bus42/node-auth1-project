const colors = require('colors');
const Users = require('../users/users-model.js');

function restricted(req, res, next) {
  if (!req.session) { console.log(colors.bgYellow.black('no session')) }
  else {
    console.log(colors.bgBlue.white('session:'), req.session.user);
  }
  next();
  // if (!req.session) {
  //   return res.status(401).send({ message: 'You shall not pass!' });
  // } else {
  //   next();
  // }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await Users.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else {
      res.status(422).send({ message: 'Username taken' });
    }
  }
  catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const users = await Users.findBy({ username: req.body.username });
    if (users.length) {
      next();
    }
    else {
      res.status(404).send({ message: 'Username does not exist' });
    }
  }
  catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  const password = req.body.password;
  if (!password || password.length < 3) {
    res.status(422).send({ message: 'Password must be longer than 3 chars' });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
