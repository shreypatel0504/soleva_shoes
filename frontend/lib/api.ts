import axios from 'axios';
import {
  Product,
  Category,
  Brand,
  Cart,
  Order,
  Review,
  User,
  Pagination,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach token from localStorage on client-side requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('soleva_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 token expiry by clearing local token
    if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('soleva_token');
        localStorage.removeItem('soleva_user');
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Services ---
export const authApi = {
  register: (data: any) => api.post<{ success: boolean; data: { user: User; token: string } }>('/auth/register', data),
  login: (data: any) => api.post<{ success: boolean; data: { user: User; token: string } }>('/auth/login', data),
  logout: () => api.post<{ success: boolean }>('/auth/logout'),
  getMe: () => api.get<{ success: boolean; data: { user: User } }>('/auth/me'),
  updateProfile: (data: any) => api.put<{ success: boolean; data: { user: User } }>('/auth/profile', data),
  changePassword: (data: any) => api.put<{ success: boolean }>('/auth/change-password', data),
  forgotPassword: (email: string) => api.post<{ success: boolean; message: string; data?: { resetToken: string } }>('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post<{ success: boolean; message: string }>('/auth/reset-password', data),
  addAddress: (address: any) => api.post<{ success: boolean; data: { addresses: any[] } }>('/auth/addresses', address),
  deleteAddress: (id: string) => api.delete<{ success: boolean; data: { addresses: any[] } }>(`/auth/addresses/${id}`),
};

// --- Product Services ---
export const productApi = {
  getProducts: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: { products: Product[] }; pagination: Pagination }>('/products', { params }),
  getProductBySlug: (slug: string) =>
    api.get<{ success: boolean; data: { product: Product; relatedProducts: Product[] } }>(`/products/slug/${slug}`),
  getProductById: (id: string) =>
    api.get<{ success: boolean; data: { product: Product } }>(`/products/${id}`),
  createProduct: (data: any) =>
    api.post<{ success: boolean; data: { product: Product } }>('/products', data),
  updateProduct: (id: string, data: any) =>
    api.put<{ success: boolean; data: { product: Product } }>(`/products/${id}`, data),
  deleteProduct: (id: string) =>
    api.delete<{ success: boolean }>(`/products/${id}`),
};

// --- Category & Brand Services ---
export const categoryApi = {
  getCategories: () => api.get<{ success: boolean; data: { categories: Category[] } }>('/categories'),
  createCategory: (data: any) => api.post<{ success: boolean; data: { category: Category } }>('/categories', data),
};

export const brandApi = {
  getBrands: () => api.get<{ success: boolean; data: { brands: Brand[] } }>('/brands'),
};

// --- Cart Services ---
export const cartApi = {
  getCart: () => api.get<{ success: boolean; data: { cart: Cart } }>('/cart'),
  addToCart: (data: { productId: string; size: number; color: string; quantity: number }) =>
    api.post<{ success: boolean; data: { cart: Cart } }>('/cart', data),
  updateCartItem: (itemId: string, quantity: number) =>
    api.put<{ success: boolean; data: { cart: Cart } }>(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId: string) =>
    api.delete<{ success: boolean; data: { cart: Cart } }>(`/cart/${itemId}`),
  clearCart: () => api.delete<{ success: boolean; data: { cart: Cart } }>('/cart'),
  syncCart: (items: any[]) => api.post<{ success: boolean; data: { cart: Cart } }>('/cart/sync', { items }),
};

// --- Wishlist Services ---
export const wishlistApi = {
  getWishlist: () => api.get<{ success: boolean; data: { wishlist: { products: Product[] } } }>('/wishlist'),
  toggleWishlist: (productId: string) =>
    api.post<{ success: boolean; data: { wishlist: { products: Product[] }; isAdded: boolean } }>(
      `/wishlist/toggle/${productId}`
    ),
  removeFromWishlist: (productId: string) =>
    api.delete<{ success: boolean; data: { wishlist: { products: Product[] } } }>(`/wishlist/${productId}`),
};

// --- Order Services ---
export const orderApi = {
  createOrder: (data: any) => api.post<{ success: boolean; data: { order: Order } }>('/orders', data),
  getMyOrders: () => api.get<{ success: boolean; data: { orders: Order[] } }>('/orders'),
  getOrderById: (id: string) => api.get<{ success: boolean; data: { order: Order } }>(`/orders/${id}`),
  cancelOrder: (id: string) => api.post<{ success: boolean; data: { order: Order } }>(`/orders/${id}/cancel`),
};

// --- Review Services ---
export const reviewApi = {
  getProductReviews: (productId: string) =>
    api.get<{
      success: boolean;
      data: {
        reviews: Review[];
        total: number;
        averageRating: number;
        distribution: Record<number, number>;
      };
    }>(`/reviews/product/${productId}`),
  createReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post<{ success: boolean; data: { review: Review; newProductRating: number } }>(
      `/reviews/product/${productId}`,
      data
    ),
};

// --- Coupon Services ---
export const couponApi = {
  validateCoupon: (code: string, orderAmount: number) =>
    api.post<{
      success: boolean;
      data: {
        code: string;
        discountType: string;
        discountValue: number;
        discountAmount: number;
      };
    }>('/coupons/validate', { code, orderAmount }),
};

// --- Newsletter & Contact Services ---
export const utilityApi = {
  subscribeNewsletter: (email: string) => api.post<{ success: boolean; message: string }>('/newsletter/subscribe', { email }),
  submitInquiry: (data: any) => api.post<{ success: boolean; message: string }>('/contact', data),
};

// --- Admin Services ---
export const adminApi = {
  getDashboardStats: () => api.get<{ success: boolean; data: any }>('/admin/dashboard'),
  getOrders: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: { orders: Order[] }; pagination: Pagination }>('/admin/orders', { params }),
  updateOrderStatus: (id: string, orderStatus: string, note?: string) =>
    api.patch<{ success: boolean; data: { order: Order } }>(`/admin/orders/${id}/status`, { orderStatus, note }),
  updatePaymentStatus: (id: string, paymentStatus: string) =>
    api.patch<{ success: boolean; data: { order: Order } }>(`/admin/orders/${id}/payment`, { paymentStatus }),
  getCustomers: (params?: Record<string, any>) =>
    api.get<{ success: boolean; data: { customers: any[] }; pagination: Pagination }>('/admin/customers', { params }),
  toggleCustomerStatus: (id: string) =>
    api.patch<{ success: boolean; data: { user: User } }>(`/admin/customers/${id}/toggle-status`),
};
