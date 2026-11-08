// src/utils/jwt.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { userId: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
}

module.exports = { generateToken };
