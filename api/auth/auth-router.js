const express = require('express');
const router = express.Router();
const users = require('../users/users-model');
const { checkUsernameFree, checkPasswordLength, checkUsernameExists } = require('../auth/auth-middleware');

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res) => {
  users.add(req.body)
    .then(user => {
      if (user) { res.status(201).send(user) }
    })
    .catch(error => {
      res.status(422).json({ message: error.message });
    });
});

router.post('/login', checkUsernameExists, (req, res) => {
  users.login(req.body)
    .then(response => res.status(200).send(response))
})

router.post('/logout', (req, res) => {
  users.logout(req.body)
    .then(user => res.status(200).send(user))
    .catch(error => res.status(422).json({ message: error.message }));
})

module.exports = router;
