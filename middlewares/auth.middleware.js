const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.oneOrNone('SELECT id, username FROM users WHERE id = $1', [decoded.id]);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ AUTH ERROR:', err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
