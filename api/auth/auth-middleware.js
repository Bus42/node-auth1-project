const Users = require('../users/users-model.js');

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'You shall not pass!' });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await Users.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else {
      next({ message: 'Username taken', status: 422 });
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
      req.user = users[0];
      next();
    }
    else {
      next({ message: 'Invalid credentials', status: 401 });
    }
  }
  catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 3) {
    next({ message: 'Password must be longer than 3 chars', status: 422 });
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
