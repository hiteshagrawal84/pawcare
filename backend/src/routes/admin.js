const express = require('express');
const admin = require('../controllers/adminController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/settings', admin.getSettings);
router.get('/reviews', admin.getReviews);
router.post('/newsletter', admin.subscribeNewsletter);

router.post('/reviews', protect, admin.createReview);

router.use(protect);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/dashboard', admin.getDashboardStats);
router.patch('/settings', admin.updateSettings);
router.get('/media', admin.getMedia);
router.post('/media', upload.single('file'), admin.uploadMedia);
router.delete('/media/:id', admin.deleteMedia);

module.exports = router;
