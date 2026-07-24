const Service = require('../models/Service');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');

exports.getServices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  else if (req.query.all !== 'true') filter.status = 'active';
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const [services, total] = await Promise.all([
    Service.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
    Service.countDocuments(filter),
  ]);

  res.json(paginateResponse(services, total, page, limit));
});

exports.getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  });
  if (!service) throw new AppError('Service not found', 404);
  success(res, service);
});

exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  success(res, service, 'Service created', 201);
});

exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new AppError('Service not found', 404);
  success(res, service, 'Service updated');
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new AppError('Service not found', 404);
  success(res, null, 'Service deleted');
});
