import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <Link to={`/products/${product._id}`} style={styles.imgLink}>
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
          alt={product.name}
          style={styles.img}
        />
      </Link>
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>
        <Link to={`/products/${product._id}`} style={styles.nameLink}>
          <h3 style={styles.name}>{product.name}</h3>
        </Link>
        <div style={styles.rating}>
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span style={styles.reviewCount}>({product.numReviews})</span>
        </div>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          <button
            style={product.countInStock === 0 ? styles.outOfStock : styles.addBtn}
            disabled={product.countInStock === 0}
            onClick={() => addToCart(product, 1)}
          >
            {product.countInStock === 0 ? 'Out of Stock' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#16213e', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'transform 0.2s',
    display: 'flex', flexDirection: 'column',
  },
  imgLink: { display: 'block' },
  img: { width: '100%', height: '200px', objectFit: 'cover', display: 'block' },
  body: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 },
  category: {
    fontSize: '0.7rem', color: '#e94560', textTransform: 'uppercase',
    letterSpacing: '1px', fontWeight: 600,
  },
  nameLink: { textDecoration: 'none' },
  name: { color: '#eee', fontSize: '1rem', margin: 0, fontWeight: 600 },
  rating: { color: '#f5a623', fontSize: '0.85rem' },
  reviewCount: { color: '#888', marginLeft: '4px', fontSize: '0.75rem' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' },
  price: { color: '#fff', fontWeight: 700, fontSize: '1.1rem' },
  addBtn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: 600,
  },
  outOfStock: {
    background: '#444', color: '#888', border: 'none',
    padding: '6px 12px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.8rem',
  },
};

export default ProductCard;
