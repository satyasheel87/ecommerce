import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PrivateRoute, AdminRoute } from './components/common/PrivateRoute';

import Navbar  from './components/common/Navbar';
import Footer  from './components/common/Footer';

import HomePage         from './pages/HomePage';
import ProductsPage     from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage         from './pages/CartPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import CheckoutPage     from './pages/CheckoutPage';
import ProfilePage      from './pages/ProfilePage';
import OrderDetailPage  from './pages/OrderDetailPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminUsers     from './pages/admin/AdminUsers';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d1a', color: '#eee' }}>
            <Navbar />

            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/"           element={<HomePage />} />
                <Route path="/products"   element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart"       element={<CartPage />} />
                <Route path="/login"      element={<LoginPage />} />
                <Route path="/register"   element={<RegisterPage />} />

                {/* Private Routes */}
                <Route path="/checkout"   element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                <Route path="/profile"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products"  element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders"    element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
              </Routes>
            </main>

            <Footer />
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
            toastStyle={{ background: '#16213e', color: '#eee' }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
