import mongoose, { Document, Schema } from 'mongoose';

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

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  size: number | string;
  color: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IDeliveryOption {
  id: string;
  title: string;
  price: number;
  estimatedDays: string;
}

export interface IOrderTimeline {
  status: OrderStatus;
  note?: string;
  timestamp: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  deliveryOption: IDeliveryOption;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  trackingNumber?: string;
  notes?: string;
  timeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: Schema.Types.Mixed, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false }
);

const DeliveryOptionSchema = new Schema<IDeliveryOption>(
  {
    id: { type: String, required: true, default: 'standard' },
    title: { type: String, required: true, default: 'Standard Delivery' },
    price: { type: Number, required: true, default: 0 },
    estimatedDays: { type: String, default: '3-5 Business Days' },
  },
  { _id: false }
);

const TimelineSchema = new Schema<IOrderTimeline>(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    deliveryOption: { type: DeliveryOptionSchema, required: true },
    paymentMethod: { type: String, required: true, default: 'Credit Card' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Refunded',
      ],
      default: 'Confirmed',
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: '' },
    shippingFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    trackingNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
    timeline: [TimelineSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for order lookups
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
