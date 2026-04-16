import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛍️ ShopEasy</Link>

      {/* Hamburger for mobile */}
      <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <div style={{ ...styles.links, ...(menuOpen ? styles.linksOpen : {}) }}>
        <Link to="/products" style={styles.link}>Products</Link>

        <Link to="/cart" style={styles.cartLink}>
          🛒 Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>

        {user ? (
          <>
            {user.isAdmin && (
              <Link to="/admin/dashboard" style={styles.link}>Admin</Link>
            )}
            <Link to="/profile" style={styles.link}>👤 {user.name}</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '64px', background: '#1a1a2e',
    position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  logo: {
    color: '#e94560', fontSize: '1.5rem', fontWeight: 800,
    textDecoration: 'none', letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: '1.5rem',
  },
  linksOpen: {
    flexDirection: 'column', position: 'absolute', top: '64px', left: 0,
    width: '100%', background: '#1a1a2e', padding: '1rem 2rem',
  },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' },
  cartLink: {
    color: '#ccc', textDecoration: 'none', fontSize: '0.95rem',
    display: 'flex', alignItems: 'center', gap: '4px', position: 'relative',
  },
  badge: {
    background: '#e94560', color: '#fff', borderRadius: '50%',
    padding: '2px 6px', fontSize: '0.7rem', fontWeight: 700,
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #e94560',
    color: '#e94560', padding: '6px 14px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '0.9rem',
  },
  btnLink: {
    background: '#e94560', color: '#fff', padding: '6px 16px',
    borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: '#fff', fontSize: '1.5rem', cursor: 'pointer',
  },
};

export default Navbar;
