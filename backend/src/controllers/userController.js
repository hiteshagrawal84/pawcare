const User = require('../models/User');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json(paginateResponse(users, total, page, limit));
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  success(res, user);
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) throw new AppError('Required fields missing', 400);

  if (role === ROLES.SUPER_ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
    throw new AppError('Cannot create super admin', 403);
  }

  const user = await User.create({ name, email, password, phone, role: role || ROLES.CUSTOMER });
  success(res, user.toSafeObject(), 'User created', 201);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'role', 'isActive', 'avatar', 'address'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  if (updates.role === ROLES.SUPER_ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
    throw new AppError('Cannot assign super admin role', 403);
  }

  if (req.body.password) updates.password = req.body.password;

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  Object.assign(user, updates);
  await user.save();
  success(res, user.toSafeObject(), 'User updated');
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === ROLES.SUPER_ADMIN) throw new AppError('Cannot delete super admin', 403);

  await user.deleteOne();
  success(res, null, 'User deleted');
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.findIndex((id) => id.toString() === productId);

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  await user.populate('wishlist');
  success(res, user.wishlist, idx > -1 ? 'Removed from wishlist' : 'Added to wishlist');
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  success(res, user.wishlist);
});
