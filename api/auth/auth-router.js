const express = require('express');
const router = express.Router();
const Users = require('../users/users-model');
const { checkUsernameFree, checkPasswordLength, checkUsernameExists } = require('../auth/auth-middleware');
const bcrypt = require('bcryptjs');

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  Users.add({ username, password: hash })
    .then(saved => res.status(201).send(saved))
    .catch(error => res.status(500).json(error));
});

router.post('/login', checkUsernameExists, (req, res) => {
  Users.login(req.body)
    .then(response => res.status(200).send(response))
})

router.post('/logout', (req, res) => {
  Users.logout(req.body)
    .then(user => res.status(200).send(user))
    .catch(error => res.status(422).json({ message: error.message }));
})

module.exports = router;
