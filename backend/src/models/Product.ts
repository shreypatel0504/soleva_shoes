import mongoose, { Document, Schema } from 'mongoose';

export interface IProductColor {
  name: string;
  hex: string;
  image?: string;
  images?: string[];
}

export interface IProductVariant {
  sku: string;
  size: number | string;
  color: string;
  price?: number;
  stock: number;
}

export interface IProductSpecifications {
  weight?: string;
  cushioning?: string;
  drop?: string;
  upper?: string;
  midsole?: string;
  outsole?: string;
  origin?: string;
  closure?: string;
  fabric?: string;
  fit?: string;
  care?: string;
  features?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  department?: 'footwear' | 'clothing';
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discount?: number;
  colors: IProductColor[];
  sizes: (number | string)[];
  variants: IProductVariant[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  specifications: IProductSpecifications;
  createdAt: Date;
  updatedAt: Date;
}

const ProductColorSchema = new Schema<IProductColor>(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String },
    images: [{ type: String }],
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: { type: String, required: true },
    size: { type: Schema.Types.Mixed, required: true },
    color: { type: String, required: true },
    price: { type: Number },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      default: 'unisex',
      index: true,
    },
    department: {
      type: String,
      enum: ['footwear', 'clothing'],
      default: 'footwear',
      index: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    images: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one product image is required'],
    },
    price: { type: Number, required: true, min: 0, index: true },
    compareAtPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0 },
    colors: [ProductColorSchema],
    sizes: { type: [Schema.Types.Mixed], required: true, default: [7, 8, 9, 10, 11] },
    variants: [ProductVariantSchema],
    stock: { type: Number, required: true, default: 10, min: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false, index: true },
    isBestSeller: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    specifications: {
      weight: { type: String, default: '280g (Size 9)' },
      cushioning: { type: String, default: 'Responsive Energy Foam' },
      drop: { type: String, default: '8mm' },
      upper: { type: String, default: 'Engineered Micro-Knit Breathable Mesh' },
      midsole: { type: String, default: 'Dual-Density HyperStride EVA' },
      outsole: { type: String, default: 'All-Surface Vibram Grip Rubber' },
      origin: { type: String, default: 'Handcrafted Precision Assembly' },
      closure: { type: String, default: 'Lace-Up Engineered Eyelets' },
    },
  },
  {
    timestamps: true,
  }
);

// Calculate discount percentage automatically
ProductSchema.pre('save', function (next) {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discount = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

// Text indexing for fast search
ProductSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  description: 'text',
  sku: 'text',
});

// Compound indexes for fast filter queries
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ brand: 1, price: 1 });
ProductSchema.index({ isFeatured: 1, createdAt: -1 });
ProductSchema.index({ isNewArrival: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
