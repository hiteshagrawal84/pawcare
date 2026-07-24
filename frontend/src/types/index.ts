export type Role = 'super_admin' | 'admin' | 'doctor' | 'customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  wishlist?: string[];
  isActive?: boolean;
  createdAt?: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  color?: string;
  price: number;
  duration: number;
  status: string;
  featured?: boolean;
}

export interface Doctor {
  _id: string;
  name: string;
  photo?: string;
  specialization: string;
  experience: number;
  qualification?: string;
  bio?: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availability?: Array<{
    day: string;
    slots: Array<{ start: string; end: string }>;
    isAvailable: boolean;
  }>;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  category?: { _id: string; name: string; slug: string } | string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  badge?: string;
  status: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface AdoptionPet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  images: string[];
  description?: string;
  status: string;
  vaccinated?: boolean;
  neutered?: boolean;
  requests?: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    status: string;
    createdAt: string;
  }>;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags?: string[];
  author?: { name: string; avatar?: string };
  metaTitle?: string;
  metaDescription?: string;
  status: string;
  publishedAt?: string;
  views?: number;
  createdAt?: string;
}

export interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  petType: string;
  petName?: string;
  service: Service | string;
  doctor?: Doctor | string;
  date: string;
  timeSlot?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer?: User | string;
  items: Array<{
    product: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress?: Record<string, string>;
  trackingNumber?: string;
  createdAt?: string;
}

export interface Review {
  _id: string;
  customer?: { name: string; avatar?: string };
  rating: number;
  title?: string;
  comment: string;
  petType?: string;
  isFeatured?: boolean;
}

export interface Settings {
  siteName: string;
  tagline: string;
  logo?: string;
  contact: {
    email: string;
    phone: string;
    emergencyPhone: string;
    address: string;
    hours: string;
  };
  social: Record<string, string>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  announcement: { enabled: boolean; text: string };
  stats: {
    yearsExperience: number;
    happyPets: number;
    veterinarians: number;
    petsTreated: number;
  };
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
