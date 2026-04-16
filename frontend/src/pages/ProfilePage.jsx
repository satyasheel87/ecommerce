import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, getMyOrders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const { login } = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([getProfile(), getMyOrders()]);
        setForm({ name: profileRes.data.name, email: profileRes.data.email, password: '' });
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      login(data);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setMessage('❌ Update failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Account</h1>
      <div style={styles.layout}>
        {/* Profile Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Edit Profile</h2>
          {message && <p style={{ color: message.startsWith('✅') ? '#4caf50' : '#e94560', fontSize: '0.9rem' }}>{message}</p>}
          <form onSubmit={handleUpdate} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New Password (optional)</label>
              <input type="password" value={form.password} placeholder="Leave blank to keep current" onChange={(e) => setForm({ ...form, password: e.target.value })} style={styles.input} />
            </div>
            <button type="submit" style={styles.btn} disabled={saving}>
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Orders */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📦 My Orders</h2>
          {orders.length === 0 ? (
            <p style={styles.empty}>No orders yet. <Link to="/products" style={{ color: '#e94560' }}>Start shopping!</Link></p>
          ) : (
            <div style={styles.orderList}>
              {orders.map((order) => (
                <Link to={`/orders/${order._id}`} key={order._id} style={styles.orderRow}>
                  <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                  <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span style={styles.orderTotal}>₹{order.totalPrice}</span>
                  <span style={{ ...styles.orderStatus, color: order.isDelivered ? '#4caf50' : '#f5a623' }}>
                    {order.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1000px' },
  card: { background: '#16213e', borderRadius: '12px', padding: '1.5rem' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { color: '#bbb', fontSize: '0.85rem' },
  input: { background: '#0f0f1a', color: '#eee', border: '1px solid #2a2a4a', padding: '10px 12px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, marginTop: '0.3rem' },
  empty: { color: '#888', fontSize: '0.9rem' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  orderRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
    background: '#0f0f1a', padding: '0.7rem 1rem', borderRadius: '8px',
    textDecoration: 'none', color: '#ccc', fontSize: '0.85rem',
    alignItems: 'center',
  },
  orderId: { color: '#e94560', fontWeight: 700 },
  orderDate: { color: '#888' },
  orderTotal: { color: '#fff', fontWeight: 600 },
  orderStatus: { textAlign: 'right', fontWeight: 600 },
};

export default ProfilePage;
