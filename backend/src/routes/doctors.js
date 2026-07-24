const express = require('express');
const doctors = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', doctors.getDoctors);
router.get('/:id', doctors.getDoctor);

router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), doctors.createDoctor);
router.patch('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), doctors.updateDoctor);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), doctors.deleteDoctor);

module.exports = router;
