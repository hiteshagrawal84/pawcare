const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.getDoctors = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.isActive !== 'all') filter.isActive = req.query.isActive !== 'false';
  if (req.query.specialization) {
    filter.specialization = { $regex: req.query.specialization, $options: 'i' };
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { specialization: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).populate('user', 'email phone').sort({ rating: -1 }).skip(skip).limit(limit),
    Doctor.countDocuments(filter),
  ]);

  res.json(paginateResponse(doctors, total, page, limit));
});

exports.getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'email phone');
  if (!doctor) throw new AppError('Doctor not found', 404);
  success(res, doctor);
});

exports.createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, experience, qualification, bio, consultationFee, photo, availability } =
    req.body;

  let user = email ? await User.findOne({ email }) : null;
  if (!user && email && password) {
    user = await User.create({ name, email, password, role: ROLES.DOCTOR });
  } else if (!user) {
    throw new AppError('Email and password required to create doctor account', 400);
  } else {
    user.role = ROLES.DOCTOR;
    await user.save();
  }

  const doctor = await Doctor.create({
    user: user._id,
    name: name || user.name,
    photo,
    specialization,
    experience,
    qualification,
    bio,
    consultationFee,
    availability,
  });

  success(res, doctor, 'Doctor created', 201);
});

exports.updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doctor) throw new AppError('Doctor not found', 404);
  success(res, doctor, 'Doctor updated');
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  success(res, null, 'Doctor deleted');
});
