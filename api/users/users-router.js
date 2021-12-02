// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const users = require('./users-model');
const router = require('express').Router();
const { isValidID } = require('./users-middleware');

router.get('/', (req, res) => {
  users.find()
    .then(users => {
      users.map(user => delete user.password)
      res.status(200).send(users);
    })
    .catch(error => {
      res.status(500).send({ error, message: 'Failed to get users' });
    });
});

router.get('/:id', isValidID, (req, res) => {
  users.findById(req.params.id)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(error => {
      res.status(500).send({ error, message: 'Failed to get user' });
    });
});

// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
