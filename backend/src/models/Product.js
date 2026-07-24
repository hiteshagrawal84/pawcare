const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    badge: { type: String, enum: ['', 'Best Seller', 'New', 'Sale'], default: '' },
    status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  },
  { timestamps: true }
);

productSchema.pre('save', function generateSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
