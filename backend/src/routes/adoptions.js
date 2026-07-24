const express = require('express');
const adoption = require('../controllers/adoptionController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', adoption.getAdoptions);
router.get('/:id', adoption.getAdoption);
router.post('/:id/request', optionalAuth, adoption.requestAdoption);

router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), adoption.createAdoption);
router.patch('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), adoption.updateAdoption);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), adoption.deleteAdoption);
router.patch(
  '/:id/requests/:requestId',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  adoption.updateRequestStatus
);

module.exports = router;
