import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getAllUsers, getProducts } from '../../utils/api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats]   = useState({ orders: 0, users: 0, products: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          getAllOrders(), getAllUsers(), getProducts(),
        ]);
        const orders   = ordersRes.data;
        const revenue  = orders.reduce((acc, o) => acc + o.totalPrice, 0);
        setStats({ orders: orders.length, users: usersRes.data.length, products: productsRes.data.length, revenue });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const STAT_CARDS = [
    { label: 'Total Orders',   value: stats.orders,              icon: '📦', color: '#e94560' },
    { label: 'Total Users',    value: stats.users,               icon: '👥', color: '#2196f3' },
    { label: 'Products',       value: stats.products,            icon: '🛍️', color: '#4caf50' },
    { label: 'Total Revenue',  value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: '#f5a623' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.adminLinks}>
          <Link to="/admin/products" style={styles.linkBtn}>Manage Products</Link>
          <Link to="/admin/orders"   style={styles.linkBtn}>Manage Orders</Link>
          <Link to="/admin/users"    style={styles.linkBtn}>Manage Users</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={styles.statIcon}>{s.icon}</span>
            <div>
              <p style={styles.statValue(s.color)}>{s.value}</p>
              <p style={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          <Link to="/admin/orders" style={styles.viewAll}>View All →</Link>
        </div>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Order ID</span><span>Customer</span><span>Total</span><span>Status</span><span>Date</span>
          </div>
          {recentOrders.map((order) => (
            <Link to={`/orders/${order._id}`} key={order._id} style={styles.tableRow}>
              <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
              <span>{order.user?.name || 'N/A'}</span>
              <span>₹{order.totalPrice}</span>
              <span style={{ color: order.isDelivered ? '#4caf50' : '#f5a623' }}>{order.status}</span>
              <span style={{ color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, margin: 0 },
  adminLinks: { display: 'flex', gap: '0.7rem', flexWrap: 'wrap' },
  linkBtn: { background: '#16213e', color: '#ccc', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', border: '1px solid #2a2a4a' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' },
  statCard: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' },
  statIcon: { fontSize: '2rem' },
  statValue: (color) => ({ fontSize: '1.6rem', fontWeight: 800, color, margin: 0 }),
  statLabel: { color: '#888', fontSize: '0.85rem', margin: 0 },
  section: { background: '#16213e', borderRadius: '12px', padding: '1.5rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  viewAll: { color: '#e94560', textDecoration: 'none', fontSize: '0.85rem' },
  table: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tableHeader: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0.5rem 0.8rem', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tableRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0.7rem 0.8rem', background: '#0f0f1a', borderRadius: '8px', textDecoration: 'none', color: '#ccc', fontSize: '0.9rem', alignItems: 'center' },
  orderId: { color: '#e94560', fontWeight: 600 },
};

export default AdminDashboard;
