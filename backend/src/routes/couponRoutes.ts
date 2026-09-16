import { Router } from 'express';
import { validateCoupon } from '../controllers/couponController';

const router = Router();

router.post('/validate', validateCoupon);
router.post('/apply', validateCoupon);

export default router;
