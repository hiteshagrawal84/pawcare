const Pet = require('../models/Pet');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');
const { ROLES } = require('../config/constants');

exports.getPets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.user.role === ROLES.CUSTOMER) {
    filter.owner = req.user._id;
  } else if (req.query.owner) {
    filter.owner = req.query.owner;
  }

  if (req.query.type) filter.type = req.query.type;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const [pets, total] = await Promise.all([
    Pet.find(filter).populate('owner', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Pet.countDocuments(filter),
  ]);

  res.json(paginateResponse(pets, total, page, limit));
});

exports.getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('owner', 'name email phone');
  if (!pet) throw new AppError('Pet not found', 404);
  success(res, pet);
});

exports.createPet = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role === ROLES.CUSTOMER) data.owner = req.user._id;
  const pet = await Pet.create(data);
  success(res, pet, 'Pet created', 201);
});

exports.updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw new AppError('Pet not found', 404);

  if (
    req.user.role === ROLES.CUSTOMER &&
    pet.owner?.toString() !== req.user._id.toString()
  ) {
    throw new AppError('Not authorized', 403);
  }

  Object.assign(pet, req.body);
  await pet.save();
  success(res, pet, 'Pet updated');
});

exports.deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw new AppError('Pet not found', 404);

  if (
    req.user.role === ROLES.CUSTOMER &&
    pet.owner?.toString() !== req.user._id.toString()
  ) {
    throw new AppError('Not authorized', 403);
  }

  await pet.deleteOne();
  success(res, null, 'Pet deleted');
});
