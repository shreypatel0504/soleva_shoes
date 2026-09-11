export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  images?: string[];
}

export interface ProductVariant {
  sku: string;
  size: number;
  color: string;
  price?: number;
  stock: number;
}

export interface ProductSpecifications {
  weight?: string;
  cushioning?: string;
  drop?: string;
  upper?: string;
  midsole?: string;
  outsole?: string;
  origin?: string;
  closure?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discount?: number;
  colors: ProductColor[];
  sizes: number[];
  variants?: ProductVariant[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  specifications?: ProductSpecifications;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  order: number;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  email?: string;
  street?: string;
  address?: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  isActive?: boolean;
  createdAt?: string;
}

export interface CartItem {
  _id?: string;
  product: Product | string;
  name: string;
  image: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalQuantity?: number;
  subtotal?: number;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderTimeline {
  status: string;
  note?: string;
  timestamp: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryOption: {
    id: string;
    title: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  trackingNumber?: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string | User;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}
