import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser    = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile   = ()     => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts      = (keyword = '', category = '') =>
  API.get(`/products?keyword=${keyword}&category=${category}`);
export const getProductById   = (id)   => API.get(`/products/${id}`);
export const createProduct    = (data) => API.post('/products', data);
export const updateProduct    = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct    = (id)   => API.delete(`/products/${id}`);
export const createReview     = (id, data) => API.post(`/products/${id}/reviews`, data);

// ─── Orders ──────────────────────────────────────────────────────────────────
export const createOrder      = (data) => API.post('/orders', data);
export const getMyOrders      = ()     => API.get('/orders/myorders');
export const getOrderById     = (id)   => API.get(`/orders/${id}`);
export const getAllOrders      = ()     => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// ─── Users (Admin) ───────────────────────────────────────────────────────────
export const getAllUsers  = ()     => API.get('/users');
export const deleteUser   = (id)   => API.delete(`/users/${id}`);
export const updateUser   = (id, data) => API.put(`/users/${id}`, data);

export default API;
