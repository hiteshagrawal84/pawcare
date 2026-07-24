const express = require('express');
const orders = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.post('/', orders.createOrder);
router.get('/', orders.getOrders);
router.get('/:id', orders.getOrder);
router.patch('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), orders.updateOrder);

module.exports = router;
