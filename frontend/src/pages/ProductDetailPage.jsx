import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createReview } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(id, { rating, comment });
      setReviewMsg('✅ Review submitted!');
      const { data } = await getProductById(id);
      setProduct(data);
      setComment('');
    } catch (err) {
      setReviewMsg('❌ ' + (err.response?.data?.message || 'Error submitting review'));
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p style={styles.error}>Product not found.</p>;

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.container}>
        <img
          src={product.image || 'https://via.placeholder.com/500x400?text=Product'}
          alt={product.name}
          style={styles.img}
        />
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.name}>{product.name}</h1>
          <div style={styles.rating}>
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span style={styles.ratingText}> {product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <p style={styles.price}>₹{product.price.toLocaleString()}</p>
          <p style={styles.desc}>{product.description}</p>
          <p style={styles.stock}>
            Status: <strong style={{ color: product.countInStock > 0 ? '#4caf50' : '#e94560' }}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
            </strong>
          </p>
          {product.countInStock > 0 && (
            <div style={styles.qtyRow}>
              <label style={styles.label}>Qty:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={styles.select}
              >
                {[...Array(Math.min(product.countInStock, 5)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            style={product.countInStock === 0 ? styles.disabledBtn : styles.addBtn}
          >
            {product.countInStock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewTitle}>Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p style={styles.noReviews}>No reviews yet. Be the first!</p>
        ) : (
          product.reviews.map((r) => (
            <div key={r._id} style={styles.reviewCard}>
              <strong style={styles.reviewName}>{r.name}</strong>
              <span style={styles.reviewRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <p style={styles.reviewComment}>{r.comment}</p>
            </div>
          ))
        )}

        {user ? (
          <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
            <h3 style={styles.writeReview}>Write a Review</h3>
            {reviewMsg && <p style={styles.reviewMsg}>{reviewMsg}</p>}
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={styles.select}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              style={styles.textarea}
              rows={4}
              required
            />
            <button type="submit" style={styles.addBtn}>Submit Review</button>
          </form>
        ) : (
          <p style={styles.loginPrompt}>
            <a href="/login" style={{ color: '#e94560' }}>Login</a> to write a review.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  back: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '1rem', marginBottom: '1.5rem' },
  container: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' },
  img: { width: '100%', borderRadius: '12px', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  category: { color: '#e94560', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 },
  name: { fontSize: '1.8rem', fontWeight: 800, margin: 0 },
  rating: { color: '#f5a623', fontSize: '1rem' },
  ratingText: { color: '#888', fontSize: '0.85rem' },
  price: { fontSize: '2rem', fontWeight: 800, color: '#e94560', margin: 0 },
  desc: { color: '#aaa', lineHeight: 1.7 },
  stock: { color: '#ccc', fontSize: '0.9rem' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  label: { color: '#ccc' },
  select: { background: '#16213e', color: '#eee', border: '1px solid #333', padding: '8px 12px', borderRadius: '6px' },
  addBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' },
  disabledBtn: { background: '#444', color: '#888', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'not-allowed', fontSize: '1rem' },
  reviewsSection: { maxWidth: '1100px', margin: '3rem auto 0' },
  reviewTitle: { fontSize: '1.4rem', fontWeight: 700, borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginBottom: '1.5rem' },
  noReviews: { color: '#888' },
  reviewCard: { background: '#16213e', borderRadius: '8px', padding: '1rem', marginBottom: '0.8rem' },
  reviewName: { color: '#fff', marginRight: '0.5rem' },
  reviewRating: { color: '#f5a623', fontSize: '0.9rem' },
  reviewComment: { color: '#bbb', marginTop: '0.4rem' },
  reviewForm: { background: '#16213e', borderRadius: '10px', padding: '1.5rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  writeReview: { margin: 0, color: '#fff' },
  reviewMsg: { color: '#4caf50' },
  textarea: { background: '#0f0f1a', color: '#eee', border: '1px solid #333', padding: '10px', borderRadius: '6px', resize: 'vertical', fontSize: '0.95rem' },
  loginPrompt: { color: '#888', marginTop: '1rem' },
  error: { textAlign: 'center', padding: '4rem', color: '#e94560' },
};

export default ProductDetailPage;
