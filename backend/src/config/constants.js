const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  CUSTOMER: 'customer',
};

const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.DOCTOR]: 2,
  [ROLES.CUSTOMER]: 1,
};

const APPOINTMENT_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];
const ORDER_STATUS = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const ADOPTION_STATUS = ['available', 'pending', 'adopted'];
const ADOPTION_REQUEST_STATUS = ['pending', 'approved', 'rejected'];
const PET_TYPES = ['dog', 'cat', 'rabbit', 'bird', 'other'];
const BLOG_CATEGORIES = ['Pet Health', 'Training', 'Nutrition', 'Grooming'];

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  APPOINTMENT_STATUS,
  ORDER_STATUS,
  ADOPTION_STATUS,
  ADOPTION_REQUEST_STATUS,
  PET_TYPES,
  BLOG_CATEGORIES,
};
