const express = require('express');
const pets = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.get('/', pets.getPets);
router.post('/', pets.createPet);
router.get('/:id', pets.getPet);
router.patch('/:id', pets.updatePet);
router.delete('/:id', pets.deletePet);

module.exports = router;
