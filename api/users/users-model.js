const db = require('../../data/db-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const colors = require('colors');

async function add(user) {
  // stores password hash, returns user
  const hash = bcrypt.hashSync(user.password, 10);
  const [user_id] = await db('users').insert({ ...user, password: hash });
  console.log(colors.bgCyan.white(`Added user with id: ${user_id}`));
  let newUser = await findById(user_id);
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
  try {
    const users = await db('users').select('user_id', 'username');
    return users;
  } catch (error) {
    return ({ error, message: "error in users-model.js -> find" });
  }
}

async function findBy(criteria) {
  // resolves to an ARRAY with all users matching given criteria, each user having { user_id, username }
  const users = await db('users')
    .where(criteria.filter, criteria.value).select('user_id', 'username');
  return users;
}

async function findById(id) {
  console.group(colors.america('*** findById ***'))
  const user = await findBy({ filter: 'user_id', value: id });
  console.log(colors.rainbow(`Found user with id: ${id}`));
  console.log(colors.red('--- end findById ---'));
  console.groupEnd('findById');
  return user[0];
}

async function logout(user) {
  return `${user.username} has logged out`;
}

module.exports = {
  find,
  findBy,
  findById,
  add,
  login,
  logout,
};
