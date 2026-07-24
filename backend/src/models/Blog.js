const mongoose = require('mongoose');
const slugify = require('slugify');
const { BLOG_CATEGORIES } = require('../config/constants');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category: { type: String, enum: BLOG_CATEGORIES, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('save', function generateSlug(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
