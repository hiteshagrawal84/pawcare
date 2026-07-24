const express = require('express');
const appointments = require('../controllers/appointmentController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.post('/', optionalAuth, appointments.createAppointment);
router.get('/', protect, appointments.getAppointments);
router.get('/:id', protect, appointments.getAppointment);
router.patch(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR),
  appointments.updateAppointment
);
router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  appointments.deleteAppointment
);

module.exports = router;
