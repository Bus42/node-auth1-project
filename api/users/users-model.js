const db = require('../../data/db-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const colors = require('colors');

function trimPassword(user) {
  // returns a copy of the user with the password trimmed
  const trimmedUser = { ...user };
  delete trimmedUser.password;
  return trimmedUser;
}

async function add(user) {
  // stores password hash, returns user
  try {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const [user_id] = await db('users').insert(user);
    const newUser = await findById(user_id);
    // trimPassword(newUser);
    return newUser;
  } catch (error) {
    return ({ error, message: 'Error registering user' });
  }
}

async function login(user) {
  // compares password hash with password entered, returns new user and json web token if successful
  try {
    const foundUser = await findBy({ username: user.username });
    if (foundUser && bcrypt.compareSync(user.password, foundUser.password)) {
      const token = jwt.sign({ id: foundUser.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      trimPassword(foundUser);
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
    users.map(user => trimPassword(user));
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> find" });
  }
}

async function findBy(filter, value) {
  console.log(`Finding user by ${filter}: ${value}`.cyan);
  // resolves to an ARRAY with all users in users database that match the filter condition
  try {
    const users = await db('users').where({ [filter]: value })
      .select('user_id', 'username')
    console.log(users);
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> findBy" });
  }
}

async function findById(user_id) {
  // resolves to the user { user_id, username } with the given user_id
  try {
    const user = db('users').where({ user_id }).first() || false;
    trimPassword(user);
    return user;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> findById" });
  }
}


// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
  login
};
