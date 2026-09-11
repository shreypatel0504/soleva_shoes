import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      brand,
      size,
      color,
      minPrice,
      maxPrice,
      rating,
      gender,
      onSale,
      inStock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sort = 'featured',
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { isActive: true };

    // Search query
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Category filter (supports comma separated or single)
    if (category) {
      const categories = (category as string).split(',').map((c) => c.trim().toLowerCase());
      query.category = { $in: categories.map((c) => new RegExp(`^${c}$`, 'i')) };
    }

    // Brand filter
    if (brand) {
      const brands = (brand as string).split(',').map((b) => b.trim());
      query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    // Gender filter
    if (gender && gender !== 'all') {
      const genders = (gender as string).split(',').map((g) => g.trim().toLowerCase());
      query.gender = { $in: [...genders, 'unisex'] };
    }

    // Size filter
    if (size) {
      const sizes = (size as string).split(',').map(Number).filter((s) => !isNaN(s));
      if (sizes.length > 0) {
        query.sizes = { $in: sizes };
      }
    }

    // Color filter
    if (color) {
      const colors = (color as string).split(',').map((c) => c.trim());
      query['colors.name'] = { $in: colors.map((c) => new RegExp(`^${c}$`, 'i')) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (rating && !isNaN(Number(rating))) {
      query.rating = { $gte: Number(rating) };
    }

    // On Sale filter
    if (onSale === 'true') {
      query.discount = { $gt: 0 };
    }

    // Stock availability filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Badge filters
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }
    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    // Sorting
    let sortOptions: any = { isFeatured: -1, createdAt: -1 };
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'popular':
        sortOptions = { isBestSeller: -1, reviewCount: -1, rating: -1 };
        break;
      default:
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limitNum);

    return sendSuccess({
      res,
      message: 'Products retrieved successfully',
      data: { products },
      pagination: {
        total,
        page: pageNum,
        pages,
        limit: limitNum,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) {
      return sendError(res, 404, `Product not found with slug: ${slug}`);
    }

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    return sendSuccess({
      res,
      message: 'Product retrieved successfully',
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess({
      res,
      message: 'Product retrieved successfully',
      data: { product },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    // Generate slug from name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Check slug uniqueness
    const existingSlug = await Product.findOne({ slug: productData.slug });
    if (existingSlug) {
      productData.slug = `${productData.slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await Product.create(productData);

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    Object.assign(product, updates);
    await product.save();

    return sendSuccess({
      res,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess({
      res,
      message: 'Product deleted successfully',
      data: null,
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
