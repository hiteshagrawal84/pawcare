const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../utils/errors');
const { ROLE_HIERARCHY } = require('../config/constants');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401);
  }

  req.user = user;
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      const user = await User.findById(decoded.id);
      if (user?.isActive) req.user = user;
    } catch {
      // ignore invalid tokens for optional auth
    }
  }
  next();
});

const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  });

const authorizeMinRole = (minRole) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const required = ROLE_HIERARCHY[minRole] || 99;
    if (userLevel < required) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  });

module.exports = { protect, optionalAuth, authorize, authorizeMinRole };
