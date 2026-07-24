const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },
    qualification: { type: String, default: '' },
    bio: { type: String, default: '' },
    consultationFee: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    availability: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        slots: [{ start: String, end: String }],
        isAvailable: { type: Boolean, default: true },
      },
    ],
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
