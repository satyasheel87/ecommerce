import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.grid}>
      <div>
        <h3 style={styles.brand}>🛍️ ShopEasy</h3>
        <p style={styles.tagline}>Your one-stop shop for everything.</p>
      </div>
      <div>
        <h4 style={styles.heading}>Quick Links</h4>
        <ul style={styles.list}>
          <li><Link to="/"        style={styles.link}>Home</Link></li>
          <li><Link to="/products" style={styles.link}>Products</Link></li>
          <li><Link to="/cart"    style={styles.link}>Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 style={styles.heading}>Account</h4>
        <ul style={styles.list}>
          <li><Link to="/login"    style={styles.link}>Login</Link></li>
          <li><Link to="/register" style={styles.link}>Register</Link></li>
          <li><Link to="/profile"  style={styles.link}>My Orders</Link></li>
        </ul>
      </div>
      <div>
        <h4 style={styles.heading}>Contact</h4>
        <p style={styles.link}>📧 support@shopeasy.com</p>
        <p style={styles.link}>📞 +91 98765 43210</p>
      </div>
    </div>
    <div style={styles.bottom}>
      <p>© {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#0f0f1a', color: '#aaa', marginTop: 'auto' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '2rem', padding: '3rem 2rem',
  },
  brand: { color: '#e94560', fontSize: '1.3rem', marginBottom: '0.5rem' },
  tagline: { fontSize: '0.85rem', color: '#777' },
  heading: { color: '#fff', marginBottom: '1rem', fontSize: '0.95rem' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  link: { color: '#aaa', textDecoration: 'none', fontSize: '0.85rem' },
  bottom: {
    borderTop: '1px solid #222', textAlign: 'center',
    padding: '1rem', fontSize: '0.8rem', color: '#555',
  },
};

export default Footer;
