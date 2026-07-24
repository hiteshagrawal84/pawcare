const express = require('express');
const services = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', services.getServices);
router.get('/:id', services.getService);

router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), services.createService);
router.patch('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), services.updateService);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), services.deleteService);

module.exports = router;
