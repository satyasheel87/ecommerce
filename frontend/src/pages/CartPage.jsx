import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice > 499 ? 0 : 49;
  const grandTotal = totalPrice + shipping;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>🛒 Your cart is empty</h2>
        <Link to="/products" style={styles.shopBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Shopping Cart</h1>
      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.items}>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.itemCard}>
              <img
                src={item.image || 'https://via.placeholder.com/80x80?text=P'}
                alt={item.name}
                style={styles.itemImg}
              />
              <div style={styles.itemInfo}>
                <Link to={`/products/${item._id}`} style={styles.itemName}>{item.name}</Link>
                <p style={styles.itemPrice}>₹{item.price.toLocaleString()}</p>
              </div>
              <div style={styles.itemActions}>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item._id, Number(e.target.value))}
                  style={styles.select}
                >
                  {[...Array(10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
                <p style={styles.itemTotal}>₹{(item.price * item.qty).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Items Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: '#4caf50' }}>FREE</span> : `₹${shipping}`}</span>
          </div>
          {shipping > 0 && (
            <p style={styles.freeShipNote}>Add ₹{(499 - totalPrice).toFixed(0)} more for free shipping!</p>
          )}
          <div style={{ ...styles.summaryRow, ...styles.total }}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>
          <Link to="/products" style={styles.continueLink}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  itemCard: { background: '#16213e', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' },
  itemImg: { width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemName: { color: '#eee', textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: '0.3rem' },
  itemPrice: { color: '#888', fontSize: '0.9rem', margin: 0 },
  itemActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
  select: { background: '#0f0f1a', color: '#eee', border: '1px solid #333', padding: '4px 8px', borderRadius: '6px' },
  itemTotal: { color: '#e94560', fontWeight: 700, margin: 0 },
  removeBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' },
  summary: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #2a2a4a' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#bbb', fontSize: '0.95rem' },
  freeShipNote: { color: '#f5a623', fontSize: '0.8rem', margin: '0.3rem 0' },
  total: { borderTop: '1px solid #2a2a4a', marginTop: '0.5rem', paddingTop: '0.7rem', color: '#fff', fontWeight: 700, fontSize: '1.1rem' },
  checkoutBtn: {
    width: '100%', background: '#e94560', color: '#fff', border: 'none',
    padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700,
    fontSize: '1rem', marginTop: '1rem',
  },
  continueLink: { display: 'block', textAlign: 'center', color: '#888', textDecoration: 'none', marginTop: '0.8rem', fontSize: '0.85rem' },
  empty: { textAlign: 'center', padding: '5rem', color: '#eee', background: '#0f0f1a', minHeight: '100vh' },
  shopBtn: { display: 'inline-block', marginTop: '1rem', background: '#e94560', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 },
};

export default CartPage;
