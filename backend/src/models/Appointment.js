const mongoose = require('mongoose');
const { APPOINTMENT_STATUS, PET_TYPES } = require('../config/constants');

const appointmentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    petType: { type: String, enum: PET_TYPES, required: true },
    petName: { type: String, default: '' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    date: { type: Date, required: true },
    timeSlot: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: APPOINTMENT_STATUS, default: 'pending' },
    notes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ email: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
