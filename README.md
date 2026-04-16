# 🛍️ ShopEasy — Full Stack E-Commerce Project

> College Project | React + Node.js + Express + MongoDB

---

## 📁 Project Structure

```
ecommerce/
├── backend/                  ← Node.js + Express API
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    ← Register, Login, Profile
│   │   ├── productController.js ← CRUD Products + Reviews
│   │   ├── orderController.js   ← Create & Manage Orders
│   │   └── userController.js    ← Admin: Manage Users
│   ├── middleware/
│   │   └── authMiddleware.js    ← JWT protect + admin check
│   ├── models/
│   │   ├── userModel.js         ← User Schema
│   │   ├── productModel.js      ← Product + Review Schema
│   │   └── orderModel.js        ← Order Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env                  ← Environment variables
│   ├── server.js             ← Entry point
│   └── package.json
│
└── frontend/                 ← React App
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx
        │       ├── Footer.jsx
        │       ├── Loader.jsx
        │       ├── ProductCard.jsx
        │       └── PrivateRoute.jsx  ← Auth guards
        ├── context/
        │   ├── AuthContext.jsx       ← Global user state
        │   └── CartContext.jsx       ← Global cart state
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ProductsPage.jsx
        │   ├── ProductDetailPage.jsx
        │   ├── CartPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── OrderDetailPage.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminProducts.jsx
        │       ├── AdminOrders.jsx
        │       └── AdminUsers.jsx
        ├── utils/
        │   └── api.js               ← All Axios API calls
        ├── App.jsx                  ← Routes setup
        ├── index.js                 ← React entry point
        ├── index.css                ← Global styles
        └── package.json
```

---

## 🚀 How to Run

### Step 1 — Install MongoDB
Make sure MongoDB is installed and running locally.

### Step 2 — Setup Backend
```bash
cd backend
npm install
# Edit .env file:
#   MONGO_URI=mongodb://localhost:27017/ecommerce
#   JWT_SECRET=your_secret_key
#   PORT=5000
npm run dev
```
Backend will start at: **http://localhost:5000**

### Step 3 — Setup Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will start at: **http://localhost:3000**

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| POST   | /api/auth/register   | Public  | Register user      |
| POST   | /api/auth/login      | Public  | Login user         |
| GET    | /api/auth/profile    | Private | Get profile        |
| PUT    | /api/auth/profile    | Private | Update profile     |

### Products
| Method | Endpoint                    | Access       | Description         |
|--------|-----------------------------|--------------|---------------------|
| GET    | /api/products               | Public       | Get all products    |
| GET    | /api/products/:id           | Public       | Get single product  |
| POST   | /api/products               | Admin        | Create product      |
| PUT    | /api/products/:id           | Admin        | Update product      |
| DELETE | /api/products/:id           | Admin        | Delete product      |
| POST   | /api/products/:id/reviews   | Private      | Add review          |

### Orders
| Method | Endpoint                | Access  | Description         |
|--------|-------------------------|---------|---------------------|
| POST   | /api/orders             | Private | Create order        |
| GET    | /api/orders/myorders    | Private | My orders           |
| GET    | /api/orders/:id         | Private | Get order detail    |
| GET    | /api/orders             | Admin   | All orders          |
| PUT    | /api/orders/:id/status  | Admin   | Update status       |

### Users (Admin)
| Method | Endpoint       | Access | Description    |
|--------|----------------|--------|----------------|
| GET    | /api/users     | Admin  | All users      |
| DELETE | /api/users/:id | Admin  | Delete user    |
| PUT    | /api/users/:id | Admin  | Update user    |

---

## ✨ Features
- ✅ User Registration & Login (JWT Auth)
- ✅ Browse & Search Products by name/category
- ✅ Product Detail Page with Reviews
- ✅ Add to Cart / Remove / Update Quantity
- ✅ Checkout with Shipping Address
- ✅ Order History in Profile
- ✅ Admin Dashboard with Stats
- ✅ Admin: Manage Products (CRUD)
- ✅ Admin: Manage Orders & Update Status
- ✅ Admin: Manage Users
- ✅ Responsive Design (Mobile Friendly)
- ✅ Dark Theme UI

---

## 🛠️ Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18, React Router v6   |
| Styling   | Inline CSS + CSS Variables  |
| HTTP      | Axios                       |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB + Mongoose          |
| Auth      | JWT + bcryptjs              |
| Toasts    | react-toastify              |

---

## 👨‍💻 Made for College Project
