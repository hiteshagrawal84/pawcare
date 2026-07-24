const mongoose = require('mongoose');
const { PET_TYPES, ADOPTION_STATUS, ADOPTION_REQUEST_STATUS } = require('../config/constants');

const adoptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: PET_TYPES, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    location: { type: String, default: 'PawCare Clinic' },
    images: [{ type: String }],
    description: { type: String, default: '' },
    status: { type: String, enum: ADOPTION_STATUS, default: 'available' },
    vaccinated: { type: Boolean, default: true },
    neutered: { type: Boolean, default: false },
    requests: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        phone: String,
        message: String,
        status: { type: String, enum: ADOPTION_REQUEST_STATUS, default: 'pending' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Adoption', adoptionSchema);
