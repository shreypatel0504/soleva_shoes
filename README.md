# SOLEVA — Luxury Footwear E-Commerce Platform

> **Engineered for Motion. Refined for Life.**  
> A complete, production-ready, full-stack luxury footwear e-commerce application inspired by high-end Behance design standards. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Key Highlights & Design Philosophy

- **High-End Visual Identity**: Deep midnight palettes (`#0A0A0B`), warm stone grays, amber highlights, glassmorphic navigation, and refined editorial typography (`Outfit` & `Plus Jakarta Sans`).
- **Zero-Config Database**: Out-of-the-box local development powered by an automatic **in-memory MongoDB engine** (or connects seamlessly to any remote MongoDB Atlas URI via `.env`).
- **Complete Customer Journey**:
  - Dynamic Homepage with hero slides, trending marquee, curated categories, split promotional banners, and customer reviews.
  - Faceted Catalog (`/shop`) with multi-attribute filtering (category, brand, size, color, price range, in-stock, sale items) and real-time search.
  - Interactive Product Details (`/product/[slug]`) featuring multi-angle gallery, magnification zoom, size guide modal, live inventory badges, and verified customer review submissions.
  - Slide-Over Cart Drawer & Dedicated Cart Page (`/cart`) with dynamic free shipping progress meter and coupon validation.
  - Multi-Step Checkout (`/checkout`) with address auto-formatting, delivery speed selection, and mock payment gateway.
  - Order Confirmation (`/order-confirmation/[id]`) with live tracking timeline and print-ready receipt.
  - Customer Account Portal (`/account`) with profile editing, order history, address book, and security settings.
- **Enterprise Admin Management Portal (`/admin`)**:
  - Live KPI metrics (Total Gross Revenue, Total Orders, Average Order Value, Registered Customers).
  - 6-month monthly revenue & sales volume bar chart.
  - Full Product Catalog Management (`/admin/products`) with status toggles, inline creation, and editing modals.
  - Order Lifecycle Management (`/admin/orders`) with payment and shipping status updates.
  - Customer Directory (`/admin/customers`) and Inquiries Desk (`/admin/inquiries`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, React Hook Form, Zod, Axios |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose, Zod, Helmet, CORS, Rate Limiting |
| **Testing** | Jest, Supertest, mongodb-memory-server |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`) |

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (Atlas URI + in-memory fallback)
│   │   ├── controllers/     # Auth, Product, Cart, Wishlist, Order, Review, Admin, Coupon
│   │   ├── middleware/      # JWT auth, requireAdmin, optionalAuth, Zod validation, error handler
│   │   ├── models/          # Mongoose models (User, Product, Order, Category, Brand, Cart, etc.)
│   │   ├── routes/          # Express route declarations
│   │   ├── scripts/         # Realistic seed script (24 luxury shoes, demo accounts, reviews)
│   │   ├── tests/           # Jest API test suite (15 automated tests)
│   │   ├── validators/      # Zod request validation schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── (auth)/          # /login, /register, /forgot-password, /reset-password
│   │   ├── admin/           # /admin, /admin/products, /admin/orders, /admin/customers, /admin/inquiries
│   │   ├── account/         # Customer account dashboard & order history
│   │   ├── cart/            # Dedicated shopping bag page
│   │   ├── checkout/        # Multi-step checkout
│   │   ├── order-confirmation/ # Order success & timeline tracking
│   │   ├── product/[slug]/  # Product details page
│   │   ├── shop/            # Catalog with faceted filters
│   │   ├── wishlist/        # Saved items grid
│   │   ├── contact/         # Contact inquiries page
│   │   ├── layout.tsx       # Root layout with Navbar, CartDrawer, ToastProvider, Footer
│   │   └── page.tsx         # Modern luxury homepage
│   ├── components/          # Reusable UI components (Navbar, ProductCard, FilterSidebar, etc.)
│   ├── context/             # React contexts for state persistence
│   ├── lib/                 # Typed API client, utility functions, type definitions
│   └── package.json
│
├── package.json             # Root monorepo scripts
└── README.md                # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+ recommended
- **npm**: v9+

### 1. Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Start Both Backend & Frontend
You can launch both services concurrently with a single command from the root directory:
```bash
npm run dev
```

Or run them individually in separate terminal windows:
```bash
# Terminal 1 — Backend (Port 5000)
npm run dev:backend

# Terminal 2 — Frontend (Port 3000)
npm run dev:frontend
```

### 3. Seed the Database
To populate the store with 24 high-resolution luxury footwear models, demo categories, brands, coupons, reviews, and test accounts:
```bash
npm run seed
```
*(Alternatively, sending `POST http://localhost:5000/api/seed` seeds the active database on-the-fly).*

### 4. Visit the Storefront
Open your browser and navigate to:
- **Customer Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@soleva.com` | `Admin@123456` | Full Admin Dashboard, Catalog Management, Order Status Updates, Customer Metrics |
| **Customer** | `customer@example.com` | `Customer@123` | Storefront Shopping, Saved Addresses, Order History, Wishlist Sync |

---

## 🏷️ Active Promotional Coupons

Test the coupon validation at checkout or in the cart drawer:
- `WELCOME10` — 10% discount on entire cart (Min spend $50)
- `SOLEVA20` — 20% discount on entire cart (Min spend $100)
- `FLASH50` — $50 instant flat discount (Min spend $200)

---

## 🧪 Testing & Verification

Run the automated backend test suite (15 integration tests across authentication, product catalog, cart, wishlist, and orders):
```bash
npm test
```

### Test Suite Summary:
```
PASS src/tests/api.test.ts
  SOLEVA Backend API Tests
    Authentication Suite
      ✓ should register a new customer
      ✓ should reject registration with invalid email or short password
      ✓ should log in existing customer
      ✓ should reject login with wrong credentials
      ✓ should fetch current authenticated user via /api/auth/me
      ✓ should reject unauthorized access without token
    Products Suite
      ✓ should reject product creation from non-admin customer
      ✓ should allow admin to create a new product
      ✓ should retrieve list of products with pagination and filter
      ✓ should retrieve a product by slug
      ✓ should return 404 for non-existent product slug
    Cart & Wishlist Suite
      ✓ should add an item to the cart
      ✓ should toggle item in wishlist
    Order Suite
      ✓ should create an order successfully
      ✓ should reject order creation with empty cart items

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

---

## 📡 Core API Endpoints

### Authentication & Users
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Sign in and receive JWT
- `GET /api/auth/me` — Retrieve active profile (Auth required)
- `PUT /api/auth/profile` — Update name, phone, addresses (Auth required)

### Catalog & Products
- `GET /api/products` — Faceted query (`search`, `category`, `brand`, `sizes`, `colors`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`)
- `GET /api/products/:slug` — Full product details with reviews & related items
- `POST /api/products` — Create product (Admin only)
- `PUT /api/products/:id` — Update product details (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Cart & Wishlist
- `GET /api/cart` — Fetch user's persistent cart
- `POST /api/cart` — Add or increment item
- `PUT /api/cart/item` — Update item quantity
- `DELETE /api/cart/item/:id` — Remove item from cart
- `GET /api/wishlist` — Fetch saved items
- `POST /api/wishlist/toggle` — Add or remove product from wishlist

### Orders & Checkout
- `POST /api/orders` — Create new order with address and payment method
- `GET /api/orders/my-orders` — Customer's historical orders
- `GET /api/orders/:id` — Detailed order receipt with timeline
- `POST /api/coupons/validate` — Validate promotional discount codes

### Admin Dashboard
- `GET /api/admin/metrics` — Aggregate revenue, order volume, customer counts, monthly sales
- `GET /api/admin/orders` — Paginated order list with search and filter
- `PUT /api/admin/orders/:id/status` — Update shipping and payment status
- `GET /api/admin/customers` — Customer list with spend metrics

---

## 📄 License
MIT License. Built for commercial e-commerce deployment.
