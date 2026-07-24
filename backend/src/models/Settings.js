const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'PawCare' },
    tagline: { type: String, default: 'Healthy Pets, Happy Families' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    contact: {
      email: { type: String, default: 'hello@pawcare.vet' },
      phone: { type: String, default: '+1 800 572 9273' },
      emergencyPhone: { type: String, default: '+1 800 911 PETS' },
      address: { type: String, default: '123 Paw Lane, Petsville, CA 90210' },
      hours: { type: String, default: 'Mon–Sat: 8am – 8pm' },
    },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: 'PawCare | Professional Pet Care Services' },
      metaDescription: {
        type: String,
        default:
          'Complete veterinary care, grooming, training and wellness services for your beloved pets.',
      },
      ogImage: { type: String, default: '' },
    },
    email: {
      fromName: { type: String, default: 'PawCare' },
      fromEmail: { type: String, default: 'noreply@pawcare.vet' },
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: 'Professional Pet Care Services | Book Your Appointment Today',
      },
    },
    stats: {
      yearsExperience: { type: Number, default: 10 },
      happyPets: { type: Number, default: 5000 },
      veterinarians: { type: Number, default: 32 },
      petsTreated: { type: Number, default: 12000 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
