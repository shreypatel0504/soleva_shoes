import { Router } from 'express';
import {
  getDashboardStats,
  getCustomers,
  toggleCustomerStatus,
} from '../controllers/adminController';
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from '../validators/orderValidators';

const router = Router();

// Protect all admin routes
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.patch('/orders/:id/payment', validate(updatePaymentStatusSchema), updatePaymentStatus);

// Customers
router.get('/customers', getCustomers);
router.patch('/customers/:id/toggle-status', toggleCustomerStatus);

export default router;
