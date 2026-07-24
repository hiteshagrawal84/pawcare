const getPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const paginateResponse = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  },
});

const success = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

module.exports = { getPagination, paginateResponse, success };
