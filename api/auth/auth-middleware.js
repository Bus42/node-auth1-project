const colors = require('colors');

function restricted(req, res, next) {
  if(!req.session){console.log(colors.bgYellow.black('no session'))}
  else {
    console.log('session:', req.session.user);
  }
  next();
  // if (!req.session) {
  //   return res.status(401).send({ message: 'You shall not pass!' });
  // } else {
  //   next();
  // }
}

async function checkUsernameFree(req, res, next) {
  next();
  // const username = req.body.username;
  // const user = await db.findBy('username', username);
  // console.log(user);
  // if (!user) {
  //   next();
  // } else {
  //   res.status(422).send({ message: 'Username taken' });
  // }
}

function checkUsernameExists(req, res, next) {
  next();
}

function checkPasswordLength(req, res, next) {
  next();
  // const password = req.body.password;
  // if (!password || password.length < 3) {
  //   res.status(422).send({ message: 'Password must be longer than 3 chars' });
  // } else {
  //   next();
  // }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};