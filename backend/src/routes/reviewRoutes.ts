import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { reviewSchema } from '../validators/orderValidators';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', authenticate, validate(reviewSchema), createReview);

export default router;
