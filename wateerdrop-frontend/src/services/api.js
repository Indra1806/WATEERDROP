import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080' });

// Attach token to every request if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Products
export const getProducts = (params) => API.get('/products', { params });

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders');
export const cancelOrder = (id) => API.patch(`/orders/${id}/cancel`);
export const updateOrderStatus = (id, status) =>
  API.patch(`/orders/${id}/status`, { status });
