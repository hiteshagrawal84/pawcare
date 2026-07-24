const Media = require('../models/Media');
const Review = require('../models/Review');
const Settings = require('../models/Settings');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Adoption = require('../models/Adoption');
const { saveMedia, deleteFromS3 } = require('../services/storage');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  const media = await saveMedia(req.file, req.user._id, req.body.folder || 'general', req.body.alt);
  success(res, media, 'File uploaded', 201);
});

exports.getMedia = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.folder) filter.folder = req.query.folder;

  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(filter),
  ]);

  res.json(paginateResponse(items, total, page, limit));
});

exports.deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new AppError('Media not found', 404);
  await deleteFromS3(media.key);
  await media.deleteOne();
  success(res, null, 'Media deleted');
});

exports.getReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isApproved: true };
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.product) filter.product = req.query.product;
  if (req.query.doctor) filter.doctor = req.query.doctor;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  res.json(paginateResponse(reviews, total, page, limit));
});

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, customer: req.user._id });
  success(res, review, 'Review submitted', 201);
});

exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  success(res, settings);
});

exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create(req.body);
  else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  success(res, settings, 'Settings updated');
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalCustomers,
    totalAppointments,
    totalDoctors,
    totalOrders,
    productsSold,
    adoptionRequests,
    recentAppointments,
    revenueAgg,
    appointmentStats,
    customerGrowth,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.CUSTOMER }),
    Appointment.countDocuments(),
    Doctor.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } },
    ]),
    Adoption.aggregate([
      { $unwind: '$requests' },
      { $match: { 'requests.status': 'pending' } },
      { $count: 'total' },
    ]),
    Appointment.find()
      .populate('service', 'name')
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Appointment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
    User.aggregate([
      { $match: { role: ROLES.CUSTOMER } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
  ]);

  const revenueByMonth = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 12 },
  ]);

  success(res, {
    cards: {
      totalCustomers,
      appointments: totalAppointments,
      doctors: totalDoctors,
      revenue: revenueAgg[0]?.total || 0,
      productsSold: productsSold[0]?.total || 0,
      adoptionRequests: adoptionRequests[0]?.total || 0,
      totalOrders,
      totalProducts: await Product.countDocuments({ status: 'active' }),
    },
    charts: {
      appointments: appointmentStats,
      revenue: revenueByMonth,
      customerGrowth,
    },
    recentAppointments,
  });
});

exports.subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);
  success(res, { email }, 'Subscribed successfully');
});
