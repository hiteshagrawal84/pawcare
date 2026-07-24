const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  if (!items?.length) throw new AppError('Cart is empty', 400);

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== 'active') {
      throw new AppError(`Product unavailable: ${item.product}`, 400);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      quantity: item.quantity,
    });
    subtotal += product.price * item.quantity;
  }

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const order = await Order.create({
    customer: req.user._id,
    items: orderItems,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: 'paid',
    status: 'processing',
    notes,
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  success(res, order, 'Order placed successfully', 201);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.user.role === ROLES.CUSTOMER) {
    filter.customer = req.user._id;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.orderNumber = { $regex: req.query.search, $options: 'i' };
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json(paginateResponse(orders, total, page, limit));
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('items.product', 'name slug');
  if (!order) throw new AppError('Order not found', 404);

  if (
    req.user.role === ROLES.CUSTOMER &&
    order.customer._id.toString() !== req.user._id.toString()
  ) {
    throw new AppError('Not authorized', 403);
  }

  success(res, order);
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const allowed = ['status', 'paymentStatus', 'trackingNumber', 'notes', 'shippingAddress'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const order = await Order.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!order) throw new AppError('Order not found', 404);
  success(res, order, 'Order updated');
});
