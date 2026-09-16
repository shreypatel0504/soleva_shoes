import { Response } from 'express';
import mongoose from 'mongoose';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return sendSuccess({
      res,
      message: 'Wishlist retrieved successfully',
      data: { wishlist },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 404, 'Product not found');
    }
    const product = await Product.findById(productId);
    if (!product) return sendError(res, 404, 'Product not found');

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(product._id as any)) {
      wishlist.products.push(product._id as any);
      await wishlist.save();
    }

    await wishlist.populate('products');

    return sendSuccess({
      res,
      message: 'Product added to wishlist',
      data: { wishlist },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 404, 'Product not found');
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return sendError(res, 404, 'Wishlist not found');

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    return sendSuccess({
      res,
      message: 'Product removed from wishlist',
      data: { wishlist },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 404, 'Product not found');
    }
    const product = await Product.findById(productId);
    if (!product) return sendError(res, 404, 'Product not found');

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex((id) => id.toString() === productId);
    let isAdded = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.products.push(product._id as any);
      isAdded = true;
    }

    await wishlist.save();
    await wishlist.populate('products');

    return sendSuccess({
      res,
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      data: { wishlist, isAdded },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
