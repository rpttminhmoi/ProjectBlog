const db = require('./index');

const createUser = async (username, passwordHash) => {
  const result = await db.one(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
    [username, passwordHash]
  );
  return result;
};

const findUserByUsername = async (username) => {
  const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
  return user;
};

module.exports = {
  createUser,
  findUserByUsername,
};
