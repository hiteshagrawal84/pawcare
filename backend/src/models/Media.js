const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    key: { type: String, default: '' },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    type: { type: String, enum: ['image', 'video', 'document', 'other'], default: 'image' },
    alt: { type: String, default: '' },
    folder: { type: String, default: 'general' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
