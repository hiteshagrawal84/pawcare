const Appointment = require('../models/Appointment');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.createAppointment = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user) data.customer = req.user._id;
  if (!data.name || !data.email || !data.phone || !data.petType || !data.service || !data.date) {
    throw new AppError('Please fill all required fields', 400);
  }

  const appointment = await Appointment.create(data);
  await appointment.populate(['service', 'doctor']);
  success(res, appointment, 'Appointment requested successfully', 201);
});

exports.getAppointments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.user.role === ROLES.CUSTOMER) {
    filter.$or = [{ customer: req.user._id }, { email: req.user.email }];
  } else if (req.user.role === ROLES.DOCTOR) {
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (doctor) filter.doctor = doctor._id;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      ...(filter.$or || []),
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.dateFrom || req.query.dateTo) {
    filter.date = {};
    if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo);
  }

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('service', 'name price duration')
      .populate('doctor', 'name specialization photo')
      .populate('customer', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(filter),
  ]);

  res.json(paginateResponse(appointments, total, page, limit));
});

exports.getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('service')
    .populate('doctor')
    .populate('customer', 'name email phone');
  if (!appointment) throw new AppError('Appointment not found', 404);
  success(res, appointment);
});

exports.updateAppointment = asyncHandler(async (req, res) => {
  const allowed = ['status', 'doctor', 'date', 'timeSlot', 'notes', 'adminNotes', 'service'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('service')
    .populate('doctor');

  if (!appointment) throw new AppError('Appointment not found', 404);
  success(res, appointment, 'Appointment updated');
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) throw new AppError('Appointment not found', 404);
  success(res, null, 'Appointment deleted');
});
