const express = require('express');
const users = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.get('/wishlist', users.getWishlist);
router.post('/wishlist', users.toggleWishlist);

router
  .route('/')
  .get(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), users.getUsers)
  .post(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), users.createUser);

router
  .route('/:id')
  .get(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), users.getUser)
  .patch(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), users.updateUser)
  .delete(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), users.deleteUser);

module.exports = router;
