import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      return sendError(res, 400, 'Coupon code is required');
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return sendError(res, 404, 'Invalid or expired coupon code');
    }

    if (coupon.minOrderValue > 0 && orderAmount < coupon.minOrderValue) {
      return sendError(
        res,
        400,
        `This coupon requires a minimum purchase of $${coupon.minOrderValue}`
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((Number(orderAmount) * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return sendSuccess({
      res,
      message: 'Coupon applied successfully!',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
