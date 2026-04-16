import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [keyword, setKeyword]   = useState('');
  const [searchParams]          = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const cat = activeCategory === 'All' ? '' : activeCategory;
        const { data } = await getProducts(keyword, cat);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, activeCategory]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Products</h1>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Category Filter */}
      <div style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={activeCategory === cat ? styles.catActive : styles.catBtn}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p style={styles.empty}>No products found.</p>
      ) : (
        <>
          <p style={styles.count}>{products.length} product(s) found</p>
          <div style={styles.grid}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  header: { maxWidth: '1200px', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  searchInput: {
    background: '#16213e', border: '1px solid #333', color: '#eee',
    padding: '10px 16px', borderRadius: '8px', fontSize: '0.95rem',
    width: '280px', outline: 'none',
  },
  categories: { maxWidth: '1200px', margin: '0 auto 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' },
  catBtn: {
    background: '#16213e', color: '#aaa', border: '1px solid #333',
    padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem',
  },
  catActive: {
    background: '#e94560', color: '#fff', border: '1px solid #e94560',
    padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem',
  },
  count: { maxWidth: '1200px', margin: '0 auto 1rem', color: '#888', fontSize: '0.9rem' },
  grid: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  empty: { textAlign: 'center', color: '#888', padding: '3rem' },
};

export default ProductsPage;
