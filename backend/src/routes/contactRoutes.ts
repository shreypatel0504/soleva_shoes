import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/contactController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { contactSchema } from '../validators/orderValidators';

const router = Router();

router.post('/', validate(contactSchema), submitInquiry);
router.get('/', authenticate, requireAdmin, getInquiries);
router.patch('/:id/status', authenticate, requireAdmin, updateInquiryStatus);

export default router;
