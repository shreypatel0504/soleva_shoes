import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createOrderSchema } from '../validators/orderValidators';

const router = Router();

router.post('/', optionalAuth, validate(createOrderSchema), createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/', authenticate, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);
router.post('/:id/cancel', authenticate, cancelOrder);

export default router;
