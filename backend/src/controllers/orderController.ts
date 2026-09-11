import { Response } from 'express';
import { Order, OrderStatus } from '../models/Order';
import { Cart } from '../models/Cart';
import { Coupon } from '../models/Coupon';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const {
      items,
      shippingAddress,
      deliveryOption = { id: 'standard', title: 'Standard Delivery', price: 0, estimatedDays: '3-5 Business Days' },
      paymentMethod = 'Credit Card',
      couponCode,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, 'Order must contain at least one product');
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // Shipping calculation (free over $150 or by selected option)
    const shippingFee = subtotal > 150 ? 0 : Number(deliveryOption.price || 0);

    // Tax calculation (estimated 8%)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100;

    // Grand total
    const totalAmount = Math.max(0, taxableAmount + shippingFee + tax);

    // Generate readable orderNumber
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SLV-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: items.map((item: any) => ({
        ...item,
        total: item.price * item.quantity,
      })),
      shippingAddress,
      deliveryOption,
      paymentMethod,
      paymentStatus: 'paid', // Simulated successful payment transaction
      orderStatus: 'Confirmed',
      subtotal,
      discount,
      couponCode: couponCode || '',
      shippingFee,
      tax,
      totalAmount,
      notes: notes || '',
      timeline: [
        {
          status: 'Confirmed',
          note: 'Payment verified and order confirmed.',
          timestamp: new Date(),
        },
      ],
    });

    // Clear cart upon successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return sendSuccess({
      res,
      message: 'Orders retrieved successfully',
      data: { orders },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Verify ownership or admin role
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized access to this order');
    }

    return sendSuccess({
      res,
      message: 'Order retrieved successfully',
      data: { order },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return sendError(res, 404, 'Order not found');

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized');
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return sendError(res, 400, `Order cannot be cancelled in '${order.orderStatus}' status.`);
    }

    order.orderStatus = 'Cancelled';
    order.timeline.push({
      status: 'Cancelled',
      note: 'Order was cancelled by customer.',
      timestamp: new Date(),
    });

    await order.save();

    return sendSuccess({
      res,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Get all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'shippingAddress.fullName': searchRegex },
        { 'shippingAddress.email': searchRegex },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    return sendSuccess({
      res,
      message: 'Orders retrieved successfully',
      data: { orders },
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Update Order Status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, note } = req.body;

    const order = await Order.findById(id);
    if (!order) return sendError(res, 404, 'Order not found');

    order.orderStatus = orderStatus as OrderStatus;
    order.timeline.push({
      status: orderStatus,
      note: note || `Order status updated to ${orderStatus} by administrator.`,
      timestamp: new Date(),
    });

    await order.save();

    return sendSuccess({
      res,
      message: `Order status updated to ${orderStatus}`,
      data: { order },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

// Admin: Update Payment Status
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return sendError(res, 404, 'Order not found');

    order.paymentStatus = paymentStatus;
    await order.save();

    return sendSuccess({
      res,
      message: `Payment status updated to ${paymentStatus}`,
      data: { order },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
