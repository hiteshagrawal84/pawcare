import { api } from './api';
import type {
  ApiResponse,
  Appointment,
  AdoptionPet,
  BlogPost,
  Doctor,
  Order,
  Paginated,
  Product,
  Category,
  Review,
  Service,
  Settings,
  User,
} from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.patch<ApiResponse<User>>('/auth/profile', data),
};

export const publicApi = {
  getServices: (params = '') => api.get<Paginated<Service>>(`/services?${params}`),
  getService: (id: string) => api.get<ApiResponse<Service>>(`/services/${id}`),
  getDoctors: (params = '') => api.get<Paginated<Doctor>>(`/doctors?${params}`),
  getDoctor: (id: string) => api.get<ApiResponse<Doctor>>(`/doctors/${id}`),
  getProducts: (params = '') => api.get<Paginated<Product>>(`/products?${params}`),
  getProduct: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getCategories: () => api.get<ApiResponse<Category[]>>('/products/categories'),
  getAdoptions: (params = '') => api.get<Paginated<AdoptionPet>>(`/adoptions?${params}`),
  getAdoption: (id: string) => api.get<ApiResponse<AdoptionPet>>(`/adoptions/${id}`),
  requestAdoption: (id: string, data: Record<string, string>) =>
    api.post<ApiResponse<AdoptionPet>>(`/adoptions/${id}/request`, data),
  getBlogs: (params = '') => api.get<Paginated<BlogPost>>(`/blogs?${params}`),
  getBlog: (id: string) => api.get<ApiResponse<BlogPost>>(`/blogs/${id}`),
  getReviews: (params = '') => api.get<Paginated<Review>>(`/admin/reviews?${params}`),
  getSettings: () => api.get<ApiResponse<Settings>>('/admin/settings'),
  bookAppointment: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Appointment>>('/appointments', data),
  subscribe: (email: string) => api.post('/admin/newsletter', { email }),
};

export const customerApi = {
  getAppointments: (params = '') => api.get<Paginated<Appointment>>(`/appointments?${params}`),
  getOrders: (params = '') => api.get<Paginated<Order>>(`/orders?${params}`),
  getOrder: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  createOrder: (data: unknown) => api.post<ApiResponse<Order>>('/orders', data),
  getPets: (params = '') => api.get<Paginated<unknown>>(`/pets?${params}`),
  createPet: (data: unknown) => api.post('/pets', data),
  updatePet: (id: string, data: unknown) => api.patch(`/pets/${id}`, data),
  deletePet: (id: string) => api.delete(`/pets/${id}`),
  getWishlist: () => api.get<ApiResponse<Product[]>>('/users/wishlist'),
  toggleWishlist: (productId: string) => api.post('/users/wishlist', { productId }),
  createReview: (data: unknown) => api.post('/admin/reviews', data),
};

export const adminApi = {
  getDashboard: () => api.get<ApiResponse<Record<string, unknown>>>('/admin/dashboard'),
  getUsers: (params = '') => api.get<Paginated<User>>(`/users?${params}`),
  createUser: (data: unknown) => api.post('/users', data),
  updateUser: (id: string, data: unknown) => api.patch(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  getDoctors: (params = 'all=true') => api.get<Paginated<Doctor>>(`/doctors?${params}`),
  createDoctor: (data: unknown) => api.post('/doctors', data),
  updateDoctor: (id: string, data: unknown) => api.patch(`/doctors/${id}`, data),
  deleteDoctor: (id: string) => api.delete(`/doctors/${id}`),
  getServices: (params = 'all=true') => api.get<Paginated<Service>>(`/services?${params}`),
  createService: (data: unknown) => api.post('/services', data),
  updateService: (id: string, data: unknown) => api.patch(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getAppointments: (params = '') => api.get<Paginated<Appointment>>(`/appointments?${params}`),
  updateAppointment: (id: string, data: unknown) => api.patch(`/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete(`/appointments/${id}`),
  getPets: (params = '') => api.get<Paginated<unknown>>(`/pets?${params}`),
  getAdoptions: (params = 'all=true') => api.get<Paginated<AdoptionPet>>(`/adoptions?${params}`),
  createAdoption: (data: unknown) => api.post('/adoptions', data),
  updateAdoption: (id: string, data: unknown) => api.patch(`/adoptions/${id}`, data),
  deleteAdoption: (id: string) => api.delete(`/adoptions/${id}`),
  updateAdoptionRequest: (id: string, requestId: string, status: string) =>
    api.patch(`/adoptions/${id}/requests/${requestId}`, { status }),
  getProducts: (params = 'all=true') => api.get<Paginated<Product>>(`/products?${params}`),
  createProduct: (data: unknown) => api.post('/products', data),
  updateProduct: (id: string, data: unknown) => api.patch(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getCategories: () => api.get<ApiResponse<Category[]>>('/products/categories'),
  createCategory: (data: unknown) => api.post('/products/categories', data),
  getOrders: (params = '') => api.get<Paginated<Order>>(`/orders?${params}`),
  updateOrder: (id: string, data: unknown) => api.patch(`/orders/${id}`, data),
  getBlogs: (params = 'all=true') => api.get<Paginated<BlogPost>>(`/blogs?${params}`),
  createBlog: (data: unknown) => api.post('/blogs', data),
  updateBlog: (id: string, data: unknown) => api.patch(`/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/blogs/${id}`),
  getMedia: (params = '') => api.get<Paginated<unknown>>(`/admin/media?${params}`),
  uploadMedia: (formData: FormData) => api.post('/admin/media', formData),
  deleteMedia: (id: string) => api.delete(`/admin/media/${id}`),
  getSettings: () => api.get<ApiResponse<Settings>>('/admin/settings'),
  updateSettings: (data: unknown) => api.patch('/admin/settings', data),
};
