import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import brandRoutes from './brandRoutes';
import cartRoutes from './cartRoutes';
import wishlistRoutes from './wishlistRoutes';
import orderRoutes from './orderRoutes';
import reviewRoutes from './reviewRoutes';
import couponRoutes from './couponRoutes';
import newsletterRoutes from './newsletterRoutes';
import contactRoutes from './contactRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

// Database seed endpoint for convenience
router.post('/seed', async (req, res) => {
  try {
    const { seedDatabase } = await import('../scripts/seed');
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database seeded successfully with 24 footwear models!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Seeding failed', error: err.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SOLEVA E-Commerce API',
  });
});

export default router;
