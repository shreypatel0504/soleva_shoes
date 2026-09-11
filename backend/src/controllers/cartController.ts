import { Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return sendSuccess({
      res,
      message: 'Cart retrieved successfully',
      data: { cart },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { productId, size, color, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return sendError(res, 404, 'Product not found or currently unavailable');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item with same size and color already in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === Number(size) &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id as any,
        name: product.name,
        image: product.images[0],
        size: Number(size),
        color,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    return sendSuccess({
      res,
      message: 'Product added to cart',
      data: { cart },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 404, 'Cart not found');

    const item = cart.items.find((i) => i._id?.toString() === itemId);
    if (!item) return sendError(res, 404, 'Item not found in cart');

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((i) => i._id?.toString() !== itemId) as any;
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    await cart.populate('items.product');

    return sendSuccess({
      res,
      message: 'Cart updated',
      data: { cart },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 404, 'Cart not found');

    cart.items = cart.items.filter((i) => i._id?.toString() !== itemId) as any;
    await cart.save();
    await cart.populate('items.product');

    return sendSuccess({
      res,
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [] as any;
      await cart.save();
    }

    return sendSuccess({
      res,
      message: 'Cart cleared successfully',
      data: { cart: cart || { items: [] } },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const syncCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { items = [] } = req.body; // Guest items from localStorage

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const existing = cart.items.find(
        (i) =>
          i.product.toString() === guestItem.product &&
          i.size === Number(guestItem.size) &&
          i.color.toLowerCase() === guestItem.color.toLowerCase()
      );

      if (existing) {
        existing.quantity += Number(guestItem.quantity);
      } else {
        cart.items.push({
          product: guestItem.product,
          name: guestItem.name,
          image: guestItem.image,
          size: Number(guestItem.size),
          color: guestItem.color,
          quantity: Number(guestItem.quantity),
          price: guestItem.price,
        });
      }
    }

    await cart.save();
    await cart.populate('items.product');

    return sendSuccess({
      res,
      message: 'Cart synchronized',
      data: { cart },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
