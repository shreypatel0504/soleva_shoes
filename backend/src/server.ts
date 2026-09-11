import app from './app';
import { connectDB } from './config/db';
import { Product } from './models/Product';
import { seedDatabase } from './scripts/seed';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding pristine footwear catalog...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 SOLEVA Backend API Running!`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });

    const shutdown = () => {
      console.log('Received termination signal. Gracefully closing server...');
      server.close(() => {
        console.log('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err: any) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
