import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1, 'Product ID is required'),
        name: z.string(),
        image: z.string(),
        size: z.union([z.number(), z.string()]),
        color: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().min(0),
      })
    )
    .min(1, 'Cart is empty'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(5, 'Valid phone number required'),
    email: z.string().email('Valid email required'),
    address: z.string().min(5, 'Street address is required'),
    apartment: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(3, 'Postal/Zip code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  deliveryOption: z
    .object({
      id: z.string(),
      title: z.string(),
      price: z.number(),
      estimatedDays: z.string(),
    })
    .default({
      id: 'standard',
      title: 'Standard Delivery',
      price: 0,
      estimatedDays: '3-5 Business Days',
    }),
  paymentMethod: z.string().min(1, 'Payment method is required').default('Credit Card'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
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
  ]),
  note: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, 'Title is required'),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
