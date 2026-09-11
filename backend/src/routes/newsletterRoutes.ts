import { Router } from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController';

const router = Router();

router.post('/subscribe', subscribeNewsletter);

export default router;
