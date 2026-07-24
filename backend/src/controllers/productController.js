const Product = require('../models/Product');
const Category = require('../models/Category');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');

exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  else if (req.query.all !== 'true') filter.status = 'active';

  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json(paginateResponse(products, total, page, limit));
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  }).populate('category');
  if (!product) throw new AppError('Product not found', 404);
  success(res, product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  success(res, product, 'Product created', 201);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  success(res, product, 'Product updated');
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  success(res, null, 'Product deleted');
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  success(res, categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  success(res, category, 'Category created', 201);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError('Category not found', 404);
  success(res, category, 'Category updated');
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  success(res, null, 'Category deleted');
});
