// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express');
const router = express.Router();
const users = require('../users/users-model');
const { checkUsernameFree, checkPasswordLength } = require('../auth/auth-middleware');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res) => {
  users.add(req.body)
    .then(user => {
      res.status(201).send(user);
    })
    .catch(error => {
      res.status(422).json({ message: error.message });
    });
});



/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.post('/login', (req, res) => {
  res.status(200).send({ message: 'Welcome ' + req.body.username + '!' });
  // db.login(req.body)
  //   .then(user => res.status(200).send(user))
})


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

router.post('/logout', (req, res) => {
  res.send({ message: 'logged out' });
})


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;