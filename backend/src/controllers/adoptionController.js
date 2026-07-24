const Adoption = require('../models/Adoption');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');

exports.getAdoptions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  else if (req.query.all !== 'true') filter.status = { $in: ['available', 'pending'] };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { breed: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [pets, total] = await Promise.all([
    Adoption.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Adoption.countDocuments(filter),
  ]);

  res.json(paginateResponse(pets, total, page, limit));
});

exports.getAdoption = asyncHandler(async (req, res) => {
  const pet = await Adoption.findById(req.params.id).populate('requests.customer', 'name email');
  if (!pet) throw new AppError('Adoption listing not found', 404);
  success(res, pet);
});

exports.createAdoption = asyncHandler(async (req, res) => {
  const pet = await Adoption.create(req.body);
  success(res, pet, 'Adoption listing created', 201);
});

exports.updateAdoption = asyncHandler(async (req, res) => {
  const pet = await Adoption.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pet) throw new AppError('Adoption listing not found', 404);
  success(res, pet, 'Adoption listing updated');
});

exports.deleteAdoption = asyncHandler(async (req, res) => {
  const pet = await Adoption.findByIdAndDelete(req.params.id);
  if (!pet) throw new AppError('Adoption listing not found', 404);
  success(res, null, 'Adoption listing deleted');
});

exports.requestAdoption = asyncHandler(async (req, res) => {
  const pet = await Adoption.findById(req.params.id);
  if (!pet) throw new AppError('Adoption listing not found', 404);
  if (pet.status === 'adopted') throw new AppError('This pet has already been adopted', 400);

  const { name, email, phone, message } = req.body;
  pet.requests.push({
    customer: req.user?._id,
    name: name || req.user?.name,
    email: email || req.user?.email,
    phone: phone || req.user?.phone,
    message,
  });
  if (pet.status === 'available') pet.status = 'pending';
  await pet.save();
  success(res, pet, 'Adoption request submitted', 201);
});

exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const pet = await Adoption.findById(req.params.id);
  if (!pet) throw new AppError('Adoption listing not found', 404);

  const request = pet.requests.id(req.params.requestId);
  if (!request) throw new AppError('Request not found', 404);

  request.status = status;
  if (status === 'approved') {
    pet.status = 'adopted';
    pet.requests.forEach((r) => {
      if (r._id.toString() !== request._id.toString() && r.status === 'pending') {
        r.status = 'rejected';
      }
    });
  }
  await pet.save();
  success(res, pet, 'Request status updated');
});
