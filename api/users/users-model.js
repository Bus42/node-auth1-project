const db = require('../../data/db-config');

async function add(user) {
  const [user_id] = await db('users').insert(user);
  return findById(user_id);
}

async function login(user) {
  return `${user.username} has logged in`;
}

async function find() {
  try {
    const users = await db('users').select('user_id', 'username');
    return users;
  } catch (error) {
    return ({ ...error, message: "error in users-model.js -> find" });
  }
}

async function findBy(filter) {// only used internally, so I can safely pass password
  return db('users').where(filter);
}

async function findById(user_id) {
  return db('users')
    .where('user_id', user_id)
    .select('user_id', 'username')
    .first();
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
