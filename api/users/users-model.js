const db = require('../../data/db-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(user) {
  // stores password hash, returns user
  try {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const [id] = await db('users').insert(user);
    const newUser = await findById(id);
    return newUser;
  } catch (error) {
    return ({ error, message: 'Error registering user' });
  }
}

async function login(user) {
  // compares password hash with password entered, returns json web token if successful
  try {
    const foundUser = await findBy({ username: user.username });
    if (foundUser && bcrypt.compareSync(user.password, foundUser.password)) {
      const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> find" });
  }
}

function findBy(filter) {
  // resolves to an ARRAY with all users in users database that match the filter condition
  try {
    const users = db('users').where(filter);
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> findBy" });
  }
}

async function findById(user_id) {
  // resolves to the user { user_id, username } with the given user_id
  try {
    const user = db('users').where({ user_id }).first() || false;
    return user;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> findById" });
  }
}

async function add(user) {
  // resolves to the newly inserted user { user_id, username }
  try {
    const newUser = db('users').insert(user);
    return newUser;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> add" });
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
  login,
  register
};
