const Blog = require('../models/Blog');
const { AppError, asyncHandler } = require('../utils/errors');
const { getPagination, paginateResponse, success } = require('../utils/api');

exports.getBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  else if (req.query.all !== 'true') filter.status = 'published';

  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.json(paginateResponse(blogs, total, page, limit));
});

exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  }).populate('author', 'name avatar');
  if (!blog) throw new AppError('Blog post not found', 404);

  blog.views += 1;
  await blog.save({ validateBeforeSave: false });
  success(res, blog);
});

exports.createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  success(res, blog, 'Blog created', 201);
});

exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) throw new AppError('Blog post not found', 404);
  success(res, blog, 'Blog updated');
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new AppError('Blog post not found', 404);
  success(res, null, 'Blog deleted');
});
