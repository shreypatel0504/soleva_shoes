import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  gender: z.enum(['men', 'women', 'unisex', 'kids']).default('unisex'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  images: z.array(z.string().url('Image must be a valid URL')).min(1, 'At least one image is required'),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
      image: z.string().optional(),
    })
  ).min(1, 'At least one color is required'),
  sizes: z.array(z.number().positive()).min(1, 'At least one size is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  specifications: z
    .object({
      weight: z.string().optional(),
      cushioning: z.string().optional(),
      drop: z.string().optional(),
      upper: z.string().optional(),
      midsole: z.string().optional(),
      outsole: z.string().optional(),
      origin: z.string().optional(),
      closure: z.string().optional(),
    })
    .optional(),
});
