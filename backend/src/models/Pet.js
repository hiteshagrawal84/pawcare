const mongoose = require('mongoose');
const { PET_TYPES } = require('../config/constants');

const petSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: PET_TYPES, required: true },
    breed: { type: String, default: '' },
    age: { type: String, default: '' },
    ageYears: { type: Number, default: 0 },
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    images: [{ type: String }],
    color: { type: String, default: '' },
    weight: { type: Number },
    microchipId: { type: String, default: '' },
    healthRecords: [
      {
        title: String,
        description: String,
        date: Date,
        veterinarian: String,
        documents: [String],
      },
    ],
    vaccinations: [
      {
        name: String,
        date: Date,
        nextDue: Date,
      },
    ],
    notes: { type: String, default: '' },
    isAdoptionListing: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
