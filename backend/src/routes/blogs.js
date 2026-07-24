const express = require('express');
const blogs = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', blogs.getBlogs);
router.get('/:id', blogs.getBlog);
router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), blogs.createBlog);
router.patch('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), blogs.updateBlog);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), blogs.deleteBlog);

module.exports = router;
