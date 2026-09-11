import { Router } from 'express';
import { getBrands, createBrand } from '../controllers/brandController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBrands);
router.post('/', authenticate, requireAdmin, createBrand);

export default router;
