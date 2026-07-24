const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    icon: { type: String, default: '🐾' },
    color: { type: String, default: '#e8f5e9' },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 30, comment: 'minutes' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

serviceSchema.pre('save', function generateSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
