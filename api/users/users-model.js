const db = require('../../data/db-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const colors = require('colors');
const { contentSecurityPolicy } = require('helmet');

function trimPassword(user) {
  if (user.password) { delete user.password; }
  return user;
}

async function add(user) {
  // stores password hash, returns user
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  const [user_id] = await db('users').insert(user);
  console.log(`Added user with id: ${user_id}`.cyan);
  const newUser = await findById(user_id);
  trimPassword(newUser);
  return newUser;
}

async function login(user) {
  // compares password hash with password entered, returns new user and json web token if successful
  try {
    let foundUser = await findBy({ filter: 'username', value: user.username });
    if (foundUser && bcrypt.compareSync(user.password, foundUser.password)) {
      const token = jwt.sign({ id: foundUser.user_id }, process.env.SESSION_SECRET, { expiresIn: '1h' });
      // foundUser = trimPassword(foundUser);
      return {
        ...foundUser,
        token,
      };
    }
    return null;
  } catch (error) {
    return ({ error, message: 'Error logging in user' });
  }
}

async function find() {
  // resolves to an ARRAY with all users, each user having { user_id, username }
  try {
    const users = await db('users');
    // users.map(user => trimPassword(user));
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> find" });
  }
}

async function findBy(criteria) {
  // resolves to an ARRAY with all users matching given criteria, each user having { user_id, username }
  console.group('*** findBy ***'.america)
  console.table(criteria);
  const { filter, value } = criteria;
  const users = await db('users')
    .where(filter, value);
  console.log(users);
  users.map(user => trimPassword(user));
  console.log('--- end findBy ---'.red);
  console.groupEnd('findBy');
  return users;
}

async function findById(id) {
  console.group('*** findById ***'.america)
  const user = await findBy({ filter: 'user_id', value: id });
  console.log(`Found user ${user.username} with id: ${id}`.cyan);
  console.groupEnd('findById');
  return user[0];
}


// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
  login
};
