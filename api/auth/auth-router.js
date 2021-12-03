require('dotenv').config();
const express = require('express');
const router = express.Router();
const Users = require('../users/users-model');
const { checkUsernameFree, checkPasswordLength, checkUsernameExists } = require('../auth/auth-middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  Users.add({ username, password: hash })
    .then(saved => res.status(201).send(saved))
    .catch(error => res.status(500).json(error));
});

router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    const token = generateToken(req.user);
    req.session.user = req.user
    res.status(200).send({ message: `Welcome ${req.user.username}`, token });
  } else {
    next({
      status: 401,
      message: 'Invalid credentials'
    });
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next(err)
      } else {
        next({ message: 'Logged out', status: 200 })
      }
    });
  } else {
    next({ message: 'No session', status: 401 })
  }
})

function generateToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username
  }
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options)

}

module.exports = router;
