const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

module.exports = { signToken, verifyToken };
