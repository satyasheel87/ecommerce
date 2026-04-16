import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice > 499 ? 0 : 49;

  const [address, setAddress] = useState({ address: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name, qty: item.qty, image: item.image,
          price: item.price, product: item._id,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice:    totalPrice,
        shippingPrice: shipping,
        totalPrice:    totalPrice + shipping,
      };
      const { data } = await createOrder(orderData);
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Checkout</h1>
      <div style={styles.layout}>
        {/* Shipping Address */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📦 Shipping Address</h2>
          {[
            { label: 'Street Address', name: 'address', placeholder: '123 Main Street' },
            { label: 'City',           name: 'city',    placeholder: 'Mumbai' },
            { label: 'State',          name: 'state',   placeholder: 'Maharashtra' },
            { label: 'Pincode',        name: 'pincode', placeholder: '400001' },
          ].map(({ label, name, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                name={name} required value={address[name]}
                onChange={handleChange} placeholder={placeholder}
                style={styles.input}
              />
            </div>
          ))}

          <h2 style={{ ...styles.sectionTitle, marginTop: '2rem' }}>💳 Payment Method</h2>
          {['COD', 'UPI', 'Card'].map((method) => (
            <label key={method} style={styles.radioLabel}>
              <input
                type="radio" value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                style={{ marginRight: '8px' }}
              />
              {method === 'COD' ? '💵 Cash on Delivery' : method === 'UPI' ? '📱 UPI / GPay' : '💳 Credit/Debit Card'}
            </label>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.itemRow}>
              <span style={styles.itemName}>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <hr style={styles.hr} />
          <div style={styles.itemRow}><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
          <div style={styles.itemRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div style={{ ...styles.itemRow, ...styles.grandTotal }}>
            <span>Total</span><span>₹{(totalPrice + shipping).toLocaleString()}</span>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handlePlaceOrder} style={styles.placeBtn} disabled={loading || cartItems.length === 0}>
            {loading ? 'Placing Order...' : '✅ Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', maxWidth: '1000px', margin: '0 auto', alignItems: 'start' },
  section: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { color: '#bbb', fontSize: '0.85rem' },
  input: { background: '#0f0f1a', color: '#eee', border: '1px solid #2a2a4a', padding: '10px 12px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  radioLabel: { color: '#ccc', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  summary: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '80px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#bbb', fontSize: '0.9rem' },
  itemName: { maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  hr: { border: 'none', borderTop: '1px solid #2a2a4a', margin: '0.5rem 0' },
  grandTotal: { color: '#fff', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #2a2a4a', marginTop: '0.3rem', paddingTop: '0.6rem' },
  error: { color: '#e94560', fontSize: '0.9rem' },
  placeBtn: {
    width: '100%', background: '#e94560', color: '#fff', border: 'none',
    padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700,
    fontSize: '1rem', marginTop: '1rem',
  },
};

export default CheckoutPage;
