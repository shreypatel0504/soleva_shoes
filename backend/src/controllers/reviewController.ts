import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    reviews.forEach((r) => {
      const score = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (distribution[score] !== undefined) {
        distribution[score] += 1;
      }
      totalScore += r.rating;
    });

    const averageRating = reviews.length > 0 ? Math.round((totalScore / reviews.length) * 10) / 10 : 0;

    return sendSuccess({
      res,
      message: 'Reviews retrieved successfully',
      data: {
        reviews,
        total: reviews.length,
        averageRating,
        distribution,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return sendError(res, 404, 'Product not found');

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return sendError(res, 400, 'You have already reviewed this product.');
    }

    // Check if user purchased this product for verified badge
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: Boolean(hasOrdered),
    });

    // Recompute product rating and review count
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Math.round((totalRating / allReviews.length) * 10) / 10;
    product.reviewCount = allReviews.length;
    await product.save();

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Review posted successfully! Thank you for your feedback.',
      data: { review, newProductRating: product.rating },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
