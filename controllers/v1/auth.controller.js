const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../../db/user.model');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

    const existing = await findUserByUsername(username);
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password)
        return res.status(400).json({ error: 'Missing username or password' });
  
      const user = await findUserByUsername(username);
      if (!user)
        return res.status(401).json({ error: 'Invalid username or password' });
  
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid)
        return res.status(401).json({ error: 'Invalid username or password' });
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ message: 'Login successful', token });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    register,
    login,
  };
  
