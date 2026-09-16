import { Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      completedOrders,
      lowStockProducts,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed', 'Processing'] } }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly sales data for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthLabel = monthNames[m - 1];

      const found = monthlySales.find((item) => item._id.year === y && item._id.month === m);

      formattedMonthly.push({
        month: monthLabel,
        year: y,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0,
      });
    }

    return sendSuccess({
      res,
      message: 'Dashboard statistics retrieved',
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        completedOrders,
        lowStockProducts,
        monthlySales: formattedMonthly,
        recentOrders,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query: any = { role: 'customer' };

    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      User.countDocuments(query),
    ]);

    // Fetch order counts and spend for these customers
    const customerIds = customers.map((c) => c._id);
    const orderAggregates = await Order.aggregate([
      { $match: { user: { $in: customerIds }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
        },
      },
    ]);

    const aggregateMap = new Map(
      orderAggregates.map((item) => [item._id.toString(), item])
    );

    const enrichedCustomers = customers.map((c) => {
      const agg = aggregateMap.get(c._id.toString());
      return {
        ...c,
        orderCount: agg ? agg.orderCount : 0,
        totalSpent: agg ? agg.totalSpent : 0,
      };
    });

    return sendSuccess({
      res,
      message: 'Customers retrieved successfully',
      data: { customers: enrichedCustomers },
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

export const toggleCustomerStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 404, 'Customer not found');
    }
    const user = await User.findById(id);

    if (!user) return sendError(res, 404, 'Customer not found');
    if (user.role === 'admin') return sendError(res, 400, 'Cannot deactivate administrator account');

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess({
      res,
      message: `Customer account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
