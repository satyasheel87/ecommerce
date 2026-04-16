import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data.slice(0, 8)); // Show only 8 featured
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={styles.page}>
      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Shop Smarter,<br /><span style={styles.accent}>Live Better</span></h1>
          <p style={styles.heroSub}>Discover thousands of products at unbeatable prices.</p>
          <Link to="/products" style={styles.heroBtn}>Shop Now →</Link>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse Categories</h2>
        <div style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} style={styles.catCard}>
              <span style={styles.catText}>{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" style={styles.viewAll}>View All →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p style={styles.empty}>No products found. Admin can add products from the dashboard.</p>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Banner ── */}
      <section style={styles.banner}>
        <h2 style={styles.bannerTitle}>🚀 Free Shipping on Orders Above ₹499</h2>
        <Link to="/products" style={styles.bannerBtn}>Start Shopping</Link>
      </section>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', color: '#eee' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '6rem 2rem', textAlign: 'center',
    borderBottom: '2px solid #e94560',
  },
  heroContent: { maxWidth: '600px', margin: '0 auto' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.1 },
  accent: { color: '#e94560' },
  heroSub: { color: '#aaa', fontSize: '1.1rem', marginBottom: '2rem' },
  heroBtn: {
    display: 'inline-block', background: '#e94560', color: '#fff',
    padding: '14px 36px', borderRadius: '50px', textDecoration: 'none',
    fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px',
    transition: 'opacity 0.2s',
  },
  section: { padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.6rem', fontWeight: 700, margin: '0 0 1.5rem', color: '#fff' },
  viewAll: { color: '#e94560', textDecoration: 'none', fontWeight: 600 },
  catGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
  },
  catCard: {
    background: '#16213e', borderRadius: '10px', padding: '1.5rem 1rem',
    textAlign: 'center', textDecoration: 'none', border: '1px solid #222',
    transition: 'border-color 0.2s',
  },
  catText: { color: '#ccc', fontWeight: 600, fontSize: '0.9rem' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  empty: { color: '#888', textAlign: 'center', padding: '2rem' },
  banner: {
    background: '#e94560', textAlign: 'center', padding: '3rem 2rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
  },
  bannerTitle: { color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: 0 },
  bannerBtn: {
    background: '#fff', color: '#e94560', padding: '12px 30px',
    borderRadius: '50px', textDecoration: 'none', fontWeight: 700,
  },
};

export default HomePage;
