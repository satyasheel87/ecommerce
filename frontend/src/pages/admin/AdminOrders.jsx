import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import Loader from '../../components/common/Loader';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { Pending: '#f5a623', Processing: '#2196f3', Shipped: '#9c27b0', Delivered: '#4caf50', Cancelled: '#e94560' };

const AdminOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  const fetchOrders = async () => {
    const { data } = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setMsg(`✅ Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      setMsg('❌ Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Manage Orders</h1>
      {msg && <p style={styles.msg}>{msg}</p>}
      <div style={styles.stats}>
        {STATUSES.map((s) => (
          <div key={s} style={styles.statCard}>
            <span style={{ color: STATUS_COLORS[s], fontWeight: 700, fontSize: '1.3rem' }}>
              {orders.filter((o) => o.status === s).length}
            </span>
            <span style={styles.statLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div style={styles.tableWrap}>
        <div style={styles.tableHead}>
          <span>Order ID</span><span>Customer</span><span>Items</span><span>Total</span><span>Date</span><span>Status</span>
        </div>
        {orders.map((order) => (
          <div key={order._id} style={styles.tableRow}>
            <Link to={`/orders/${order._id}`} style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Link>
            <span style={styles.customer}>{order.user?.name || 'Deleted User'}</span>
            <span style={styles.items}>{order.orderItems.length} item(s)</span>
            <span style={styles.total}>₹{order.totalPrice}</span>
            <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              style={{ ...styles.select, color: STATUS_COLORS[order.status] }}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' },
  msg: { background: '#16213e', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#4caf50', fontSize: '0.9rem' },
  stats: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' },
  statCard: { background: '#16213e', borderRadius: '10px', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', minWidth: '100px' },
  statLabel: { color: '#888', fontSize: '0.75rem' },
  tableWrap: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tableHead: { display: 'grid', gridTemplateColumns: '120px 1fr 80px 100px 100px 140px', padding: '0.5rem 1rem', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '120px 1fr 80px 100px 100px 140px', background: '#16213e', padding: '0.8rem 1rem', borderRadius: '8px', alignItems: 'center', fontSize: '0.85rem' },
  orderId: { color: '#e94560', fontWeight: 600, textDecoration: 'none' },
  customer: { color: '#eee' },
  items: { color: '#888' },
  total: { color: '#f5a623', fontWeight: 600 },
  date: { color: '#888' },
  select: { background: '#0f0f1a', border: '1px solid #2a2a4a', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' },
};

export default AdminOrders;
