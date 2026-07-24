const express = require('express');
const products = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/categories', products.getCategories);
router.post(
  '/categories',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  products.createCategory
);
router.patch(
  '/categories/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  products.updateCategory
);
router.delete(
  '/categories/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  products.deleteCategory
);

router.get('/', products.getProducts);
router.get('/:id', products.getProduct);
router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), products.createProduct);
router.patch('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), products.updateProduct);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), products.deleteProduct);

module.exports = router;
