const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { AppError, asyncHandler } = require('../utils/errors');
const { success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('Email already registered', 409);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ROLES.CUSTOMER,
  });

  const token = signToken(user);
  success(res, { user: user.toSafeObject(), token }, 'Registration successful', 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user);
  success(res, { user: user.toSafeObject(), token }, 'Login successful');
});

exports.me = asyncHandler(async (req, res) => {
  success(res, req.user.toSafeObject());
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar', 'address'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  success(res, user.toSafeObject(), 'Profile updated');
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();
  success(res, null, 'Password changed successfully');
});
