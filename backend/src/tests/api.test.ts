import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

jest.setTimeout(60000);

let customerToken = '';
let adminToken = '';
let testProductId = '';

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

describe('SOLEVA Backend API Tests', () => {
  describe('Authentication Suite', () => {
    it('should register a new customer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Customer',
          email: 'test@example.com',
          password: 'password123',
          phone: '+1234567890',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.token).toBeDefined();

      customerToken = res.body.data.token;
    });

    it('should reject registration with invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'T',
          email: 'invalid-email',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should log in existing customer', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with wrong credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch current authenticated user via /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should reject unauthorized access without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Products Suite', () => {
    beforeAll(async () => {
      // Create admin user for product creation tests
      const admin = await User.create({
        name: 'Admin Tester',
        email: 'admin@tester.com',
        password: 'AdminPassword123',
        role: 'admin',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@tester.com', password: 'AdminPassword123' });
      adminToken = res.body.data.token;
    });

    it('should reject product creation from non-admin customer', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Forbidden Sneaker',
          brand: 'BrandX',
          category: 'Sneakers',
          description: 'A test sneaker with forbidden access',
          images: ['https://example.com/shoe.jpg'],
          price: 150,
          colors: [{ name: 'Black', hex: '#000000' }],
          sizes: [8, 9, 10],
          stock: 10,
          sku: 'FORB-001',
        });

      expect(res.status).toBe(403);
    });

    it('should allow admin to create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Aero Velocity Pro',
          brand: 'SOLEVA Core',
          category: 'Running',
          gender: 'unisex',
          description: 'A high-performance running sneaker with responsive foam.',
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
          price: 180,
          compareAtPrice: 210,
          colors: [{ name: 'Crimson Ember', hex: '#E63946' }],
          sizes: [8, 8.5, 9, 9.5, 10],
          stock: 15,
          sku: 'AERO-VEL-001',
          isFeatured: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.product.name).toBe('Aero Velocity Pro');
      expect(res.body.data.product.discount).toBe(14); // (210-180)/210 = 14.28% -> 14%

      testProductId = res.body.data.product._id;
    });

    it('should retrieve list of products with pagination and filter', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({ category: 'Running', page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve a product by slug', async () => {
      const res = await request(app).get('/api/products/slug/aero-velocity-pro');
      expect(res.status).toBe(200);
      expect(res.body.data.product.sku).toBe('AERO-VEL-001');
    });

    it('should return 404 for non-existent product slug', async () => {
      const res = await request(app).get('/api/products/slug/non-existent-shoe');
      expect(res.status).toBe(404);
    });
  });

  describe('Cart & Wishlist Suite', () => {
    it('should add an item to the cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: testProductId,
          size: 9,
          color: 'Crimson Ember',
          quantity: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.cart.items.length).toBe(1);
      expect(res.body.data.cart.items[0].size).toBe(9);
    });

    it('should toggle item in wishlist', async () => {
      const res = await request(app)
        .post(`/api/wishlist/toggle/${testProductId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isAdded).toBe(true);
      expect(res.body.data.wishlist.products.length).toBe(1);
    });
  });

  describe('Order Suite', () => {
    it('should create an order successfully', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [
            {
              product: testProductId,
              name: 'Aero Velocity Pro',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
              size: 9,
              color: 'Crimson Ember',
              quantity: 1,
              price: 180,
            },
          ],
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '+1234567890',
            email: 'test@example.com',
            address: 'Flat 402, Linking Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            country: 'India',
          },
          deliveryOption: {
            id: 'standard',
            title: 'Standard Free Delivery',
            price: 0,
            estimatedDays: '3-5 Business Days',
          },
          paymentMethod: 'Credit Card',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.order.orderNumber).toMatch(/^SLV-/);
      expect(res.body.data.order.totalAmount).toBeGreaterThan(0);
    });

    it('should reject order creation with empty cart items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [],
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '+1234567890',
            email: 'test@example.com',
            address: 'Flat 402, Linking Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            country: 'India',
          },
        });

      expect(res.status).toBe(400);
    });
  });
});
