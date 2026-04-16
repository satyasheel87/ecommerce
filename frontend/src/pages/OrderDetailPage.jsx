import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/api';
import Loader from '../components/common/Loader';

const STATUS_COLORS = {
  Pending:    '#f5a623',
  Processing: '#2196f3',
  Shipped:    '#9c27b0',
  Delivered:  '#4caf50',
  Cancelled:  '#e94560',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order)  return <p style={{ textAlign: 'center', color: '#e94560', padding: '4rem' }}>Order not found.</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Order Confirmed 🎉</h1>
      <p style={styles.orderId}>Order ID: <code style={styles.code}>{order._id}</code></p>

      <div style={styles.statusBadge(order.status)}>
        Status: {order.status}
      </div>

      <div style={styles.layout}>
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📦 Shipping Address</h2>
            <p style={styles.text}>{order.shippingAddress.address}</p>
            <p style={styles.text}>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💳 Payment</h2>
            <p style={styles.text}>Method: <strong>{order.paymentMethod}</strong></p>
            <p style={styles.text}>
              {order.isPaid
                ? <span style={{ color: '#4caf50' }}>✅ Paid</span>
                : <span style={{ color: '#f5a623' }}>⏳ Payment Pending</span>
              }
            </p>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🛍️ Order Items</h2>
            {order.orderItems.map((item) => (
              <div key={item.product} style={styles.itemRow}>
                <img src={item.image} alt={item.name} style={styles.itemImg} />
                <Link to={`/products/${item.product}`} style={styles.itemName}>{item.name}</Link>
                <span style={styles.itemPrice}>{item.qty} × ₹{item.price.toLocaleString()} = ₹{(item.qty * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.summary}>
          <h2 style={styles.cardTitle}>💰 Price Summary</h2>
          <div style={styles.row}><span>Items</span><span>₹{order.itemsPrice}</span></div>
          <div style={styles.row}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div style={{ ...styles.row, fontWeight: 700, color: '#fff', fontSize: '1.1rem', borderTop: '1px solid #2a2a4a', paddingTop: '0.5rem', marginTop: '0.3rem' }}>
            <span>Total</span><span>₹{order.totalPrice}</span>
          </div>
          <Link to="/products" style={styles.continueBtn}>Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '2rem', fontWeight: 800, margin: '0 0 0.3rem' },
  orderId: { color: '#888', marginBottom: '1rem', fontSize: '0.9rem' },
  code: { background: '#16213e', padding: '2px 8px', borderRadius: '4px', color: '#e94560' },
  statusBadge: (status) => ({
    display: 'inline-block', background: STATUS_COLORS[status] || '#888',
    color: '#fff', padding: '6px 16px', borderRadius: '50px',
    fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.5rem',
  }),
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', maxWidth: '1000px' },
  card: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#fff' },
  text: { color: '#bbb', margin: '0.3rem 0', fontSize: '0.9rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0', borderBottom: '1px solid #2a2a4a' },
  itemImg: { width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' },
  itemName: { color: '#eee', textDecoration: 'none', flex: 1, fontSize: '0.9rem' },
  itemPrice: { color: '#bbb', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  summary: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '80px', height: 'fit-content' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#bbb', fontSize: '0.9rem' },
  continueBtn: {
    display: 'block', textAlign: 'center', marginTop: '1.5rem',
    background: '#e94560', color: '#fff', padding: '12px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 700,
  },
};

export default OrderDetailPage;
