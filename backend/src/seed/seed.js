require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { ROLES } = require('../config/constants');

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Adoption = require('../models/Adoption');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const Settings = require('../models/Settings');
const Order = require('../models/Order');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');

  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Service.deleteMany({}),
    Appointment.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Adoption.deleteMany({}),
    Blog.deleteMany({}),
    Review.deleteMany({}),
    Settings.deleteMany({}),
    Order.deleteMany({}),
  ]);

  console.log('Creating users...');
  const superAdmin = await User.create({
    name: 'Super Admin',
    email: 'superadmin@pawcare.vet',
    password: 'Password123!',
    phone: '+18005729273',
    role: ROLES.SUPER_ADMIN,
  });

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@pawcare.vet',
    password: 'Password123!',
    phone: '+18005729274',
    role: ROLES.ADMIN,
  });

  const customer = await User.create({
    name: 'Emma Rodriguez',
    email: 'customer@pawcare.vet',
    password: 'Password123!',
    phone: '+15551234567',
    role: ROLES.CUSTOMER,
    address: {
      street: '45 Maple Street',
      city: 'Petsville',
      state: 'CA',
      zip: '90210',
      country: 'US',
    },
  });

  const doctorUsers = await User.insertMany([
    {
      name: 'Dr. Sarah Mitchell',
      email: 'sarah@pawcare.vet',
      password: 'Password123!',
      role: ROLES.DOCTOR,
      phone: '+15551110001',
    },
    {
      name: 'Dr. James Thornton',
      email: 'james@pawcare.vet',
      password: 'Password123!',
      role: ROLES.DOCTOR,
      phone: '+15551110002',
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'priya@pawcare.vet',
      password: 'Password123!',
      role: ROLES.DOCTOR,
      phone: '+15551110003',
    },
    {
      name: 'Dr. Michael Lee',
      email: 'michael@pawcare.vet',
      password: 'Password123!',
      role: ROLES.DOCTOR,
      phone: '+15551110004',
    },
  ]);

  console.log('Creating doctors...');
  const doctors = await Doctor.insertMany([
    {
      user: doctorUsers[0]._id,
      name: 'Dr. Sarah Mitchell',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format',
      specialization: 'Veterinary Surgeon',
      experience: 12,
      qualification: 'DVM, Board Certified Surgeon',
      bio: 'Specializes in soft tissue and orthopedic surgery with over a decade of clinical excellence.',
      consultationFee: 85,
      rating: 4.9,
      reviewCount: 128,
      availability: [
        { day: 'monday', slots: [{ start: '09:00', end: '17:00' }], isAvailable: true },
        { day: 'wednesday', slots: [{ start: '09:00', end: '17:00' }], isAvailable: true },
        { day: 'friday', slots: [{ start: '09:00', end: '13:00' }], isAvailable: true },
      ],
    },
    {
      user: doctorUsers[1]._id,
      name: 'Dr. James Thornton',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format',
      specialization: 'Pet Nutrition Expert',
      experience: 9,
      qualification: 'DVM, Certified Nutritionist',
      bio: 'Helps pets thrive through personalized nutrition plans and wellness coaching.',
      consultationFee: 65,
      rating: 4.8,
      reviewCount: 96,
    },
    {
      user: doctorUsers[2]._id,
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format',
      specialization: 'Animal Care Specialist',
      experience: 15,
      qualification: 'DVM, Internal Medicine',
      bio: 'Focused on preventive care and chronic disease management for dogs and cats.',
      consultationFee: 75,
      rating: 5.0,
      reviewCount: 210,
    },
    {
      user: doctorUsers[3]._id,
      name: 'Dr. Michael Lee',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format',
      specialization: 'Exotic Animal Vet',
      experience: 11,
      qualification: 'DVM, Exotic Animal Medicine',
      bio: 'Expert care for birds, rabbits, reptiles and other exotic companions.',
      consultationFee: 90,
      rating: 4.7,
      reviewCount: 74,
    },
  ]);

  console.log('Creating services...');
  const serviceData = [
    {
      name: 'Veterinary Care',
      description: 'Comprehensive health checkups, diagnostics, and expert treatments for all pets.',
      icon: '🏥',
      color: '#e8f5e9',
      price: 75,
      duration: 45,
      featured: true,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'Pet Grooming',
      description: 'Full-service grooming including baths, haircuts, nail trimming, and styling.',
      icon: '✂️',
      color: '#fff3e0',
      price: 45,
      duration: 60,
      featured: true,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'Pet Training',
      description: 'Positive reinforcement training for obedience, behavior, and advanced skills.',
      icon: '🎓',
      color: '#e3f2fd',
      price: 55,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'Pet Boarding',
      description: 'Safe, comfortable boarding with 24/7 supervision and loving care.',
      icon: '🏠',
      color: '#fce4ec',
      price: 40,
      duration: 1440,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'Pet Nutrition',
      description: 'Personalized dietary plans and premium nutrition advice from specialists.',
      icon: '🥗',
      color: '#f3e5f5',
      price: 50,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'Emergency Care',
      description: 'Round-the-clock emergency veterinary services with rapid response teams.',
      icon: '🚑',
      color: '#e8f5e9',
      price: 150,
      duration: 60,
      featured: true,
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=400&fit=crop&auto=format',
    },
  ];
  const services = [];
  for (const s of serviceData) {
    services.push(await Service.create(s));
  }

  console.log('Creating categories & products...');
  const categoryData = [
    { name: 'Pet Food', description: 'Premium nutrition for dogs and cats' },
    { name: 'Toys', description: 'Interactive and enrichment toys' },
    { name: 'Accessories', description: 'Collars, beds, and everyday essentials' },
    { name: 'Medicine', description: 'Vet-approved health products' },
    { name: 'Grooming Products', description: 'Shampoos, brushes, and kits' },
  ];
  const categories = [];
  for (const c of categoryData) {
    categories.push(await Category.create(c));
  }

  const productData = [
    {
      name: 'Premium Dog Food',
      description: 'High-protein kibble crafted with real chicken and wholesome grains for adult dogs.',
      shortDescription: 'Real chicken formula for adult dogs',
      images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop&auto=format'],
      price: 34.99,
      compareAtPrice: 39.99,
      stock: 120,
      sku: 'PC-FOOD-001',
      category: categories[0]._id,
      badge: 'Best Seller',
      featured: true,
      rating: 4.8,
      reviewCount: 24,
      tags: ['dog', 'food'],
    },
    {
      name: 'Cat Wellness Blend',
      description: 'Grain-free wellness blend supporting healthy digestion and shiny coats.',
      shortDescription: 'Grain-free cat nutrition',
      images: ['https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=300&h=300&fit=crop&auto=format'],
      price: 28.99,
      stock: 80,
      sku: 'PC-FOOD-002',
      category: categories[0]._id,
      badge: 'New',
      featured: true,
      rating: 4.6,
      reviewCount: 18,
      tags: ['cat', 'food'],
    },
    {
      name: 'Interactive Pet Toys',
      description: 'Durable puzzle toys designed to keep pets mentally stimulated and active.',
      shortDescription: 'Enrichment toys set',
      images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=300&h=300&fit=crop&auto=format'],
      price: 19.99,
      stock: 200,
      sku: 'PC-TOY-001',
      category: categories[1]._id,
      rating: 4.5,
      reviewCount: 42,
      tags: ['toys'],
    },
    {
      name: 'Pro Grooming Kit',
      description: 'Complete grooming kit with brush, nail clippers, and gentle shampoo.',
      shortDescription: 'All-in-one grooming essentials',
      images: ['https://images.unsplash.com/photo-1581888227599-779811939961?w=300&h=300&fit=crop&auto=format'],
      price: 44.99,
      compareAtPrice: 54.99,
      stock: 60,
      sku: 'PC-GROOM-001',
      category: categories[4]._id,
      badge: 'Sale',
      featured: true,
      rating: 4.7,
      reviewCount: 31,
      tags: ['grooming'],
    },
    {
      name: 'Joint Support Chews',
      description: 'Vet-formulated soft chews supporting mobility and joint health.',
      shortDescription: 'Daily joint supplements',
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'],
      price: 32.5,
      stock: 90,
      sku: 'PC-MED-001',
      category: categories[3]._id,
      rating: 4.4,
      reviewCount: 15,
      tags: ['medicine'],
    },
    {
      name: 'Comfort Pet Bed',
      description: 'Orthopedic foam bed with washable cover for restful sleep.',
      shortDescription: 'Orthopedic comfort bed',
      images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop&auto=format'],
      price: 59.99,
      stock: 40,
      sku: 'PC-ACC-001',
      category: categories[2]._id,
      rating: 4.9,
      reviewCount: 67,
      tags: ['accessories', 'bed'],
    },
  ];
  const products = [];
  for (const p of productData) {
    products.push(await Product.create(p));
  }

  console.log('Creating adoptions...');
  await Adoption.insertMany([
    {
      name: 'Buddy',
      type: 'dog',
      breed: 'Golden Retriever',
      age: '2 years',
      gender: 'male',
      location: 'PawCare Clinic',
      images: ['https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=400&fit=crop&auto=format'],
      description: 'Friendly, energetic, and great with kids. Looking for an active forever home.',
      status: 'available',
      vaccinated: true,
      neutered: true,
    },
    {
      name: 'Mochi',
      type: 'cat',
      breed: 'Tabby Cat',
      age: '1 year',
      gender: 'female',
      location: 'PawCare Clinic',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&auto=format'],
      description: 'Sweet and curious. Loves sunny windowsills and gentle cuddles.',
      status: 'available',
      vaccinated: true,
      neutered: true,
    },
    {
      name: 'Snowball',
      type: 'rabbit',
      breed: 'White Rabbit',
      age: '6 months',
      gender: 'female',
      location: 'PawCare Clinic',
      images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop&auto=format'],
      description: 'Gentle bunny who thrives with calm companionship and fresh greens.',
      status: 'available',
      vaccinated: true,
      neutered: false,
    },
  ]);

  console.log('Creating blogs...');
  const blogData = [
    {
      title: '10 Signs Your Dog Needs a Vet Visit Right Away',
      excerpt: 'Learn the warning signs that mean your dog needs immediate veterinary attention.',
      content: `<p>Recognizing early warning signs can save your pet's life. Watch for sudden lethargy, loss of appetite, vomiting, difficulty breathing, or unusual aggression.</p><p>At PawCare, our emergency team is available 24/7 to help when every minute counts.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop&auto=format',
      category: 'Pet Health',
      tags: ['dogs', 'emergency', 'health'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date('2025-07-15'),
      metaTitle: '10 Signs Your Dog Needs a Vet Visit | PawCare',
      metaDescription: 'Know when to seek urgent veterinary care for your dog.',
    },
    {
      title: 'Positive Reinforcement: The Science Behind Happier Dogs',
      excerpt: 'Why reward-based training builds stronger bonds and better behavior.',
      content: `<p>Positive reinforcement uses rewards to encourage desired behaviors. It reduces stress and creates confident, well-adjusted pets.</p><p>Our trainers use science-backed methods tailored to each pet's personality.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&auto=format',
      category: 'Training',
      tags: ['training', 'behavior'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date('2025-07-08'),
    },
    {
      title: 'What Your Cat Is Actually Telling You About Their Diet',
      excerpt: 'Decode your cat’s eating habits and optimize their nutrition.',
      content: `<p>Cats communicate through appetite changes, coat quality, and energy levels. Sudden shifts often signal dietary or medical issues.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&h=400&fit=crop&auto=format',
      category: 'Nutrition',
      tags: ['cats', 'nutrition'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date('2025-06-29'),
    },
    {
      title: 'Grooming Essentials Every Pet Parent Should Know',
      excerpt: 'A practical guide to keeping coats healthy between salon visits.',
      content: `<p>Regular brushing, nail care, and ear cleaning prevent common issues and keep pets comfortable year-round.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=400&fit=crop&auto=format',
      category: 'Grooming',
      tags: ['grooming'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date('2025-06-20'),
    },
  ];
  for (const b of blogData) {
    await Blog.create(b);
  }

  console.log('Creating appointments & reviews...');
  await Appointment.create({
    customer: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    petType: 'dog',
    petName: 'Max',
    service: services[0]._id,
    doctor: doctors[0]._id,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    timeSlot: '10:00',
    message: 'Annual checkup for Max',
    status: 'confirmed',
  });

  await Appointment.create({
    name: 'David Chen',
    email: 'david@example.com',
    phone: '+15559876543',
    petType: 'cat',
    petName: 'Luna',
    service: services[5]._id,
    doctor: doctors[2]._id,
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    message: 'Possible ear infection',
    status: 'pending',
  });

  await Review.insertMany([
    {
      customer: customer._id,
      rating: 5,
      title: 'Exceptional care',
      comment:
        'My dog Max received absolutely exceptional care here. The doctors truly understand animals — Max was relaxed the entire visit. PawCare is the only place we trust.',
      petType: 'Golden Retriever owner',
      isFeatured: true,
      isApproved: true,
    },
    {
      customer: customer._id,
      doctor: doctors[0]._id,
      rating: 5,
      comment:
        'Brought my cat Luna in for emergency care at 2am. The team was incredible — calm, professional, and incredibly compassionate.',
      petType: 'Persian Cat owner',
      isFeatured: true,
      isApproved: true,
    },
    {
      customer: customer._id,
      rating: 5,
      comment:
        'The grooming service is outstanding! Bella always comes home looking like she just walked off a photo shoot.',
      petType: 'Labrador owner',
      isFeatured: true,
      isApproved: true,
    },
  ]);

  await Order.create({
    customer: customer._id,
    items: [
      {
        product: products[0]._id,
        name: products[0].name,
        image: products[0].images[0],
        price: products[0].price,
        quantity: 2,
      },
    ],
    subtotal: 69.98,
    shipping: 0,
    tax: 5.6,
    total: 75.58,
    status: 'completed',
    paymentStatus: 'paid',
    shippingAddress: {
      name: customer.name,
      phone: customer.phone,
      street: '45 Maple Street',
      city: 'Petsville',
      state: 'CA',
      zip: '90210',
      country: 'US',
    },
  });

  await Settings.create({});

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Demo accounts (password: Password123!):');
  console.log('  Super Admin: superadmin@pawcare.vet');
  console.log('  Admin:       admin@pawcare.vet');
  console.log('  Doctor:      sarah@pawcare.vet');
  console.log('  Customer:    customer@pawcare.vet');
  console.log(`  Products: ${products.length}, Services: ${services.length}, Doctors: ${doctors.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
