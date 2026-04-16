import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import Loader from '../../components/common/Loader';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', brand: '', countInStock: '', image: '' };
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg]           = useState('');

  const fetchProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) };
      if (editId) {
        await updateProduct(editId, payload);
        setMsg('✅ Product updated!');
      } else {
        await createProduct(payload);
        setMsg('✅ Product created!');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, description: product.description, price: product.price, category: product.category, brand: product.brand, countInStock: product.countInStock, image: product.image });
    setEditId(product._id);
    setShowForm(true);
    setMsg('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    fetchProducts();
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Products</h1>
        <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); }} style={styles.addBtn}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {msg && <p style={styles.msg}>{msg}</p>}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <div style={styles.formGrid}>
            {[
              { label: 'Product Name', name: 'name',         placeholder: 'Samsung TV 55"' },
              { label: 'Brand',        name: 'brand',        placeholder: 'Samsung' },
              { label: 'Price (₹)',    name: 'price',        placeholder: '29999', type: 'number' },
              { label: 'Stock',        name: 'countInStock', placeholder: '10',    type: 'number' },
              { label: 'Image URL',    name: 'image',        placeholder: 'https://...' },
            ].map(({ label, name, placeholder, type = 'text' }) => (
              <div key={name} style={styles.field}>
                <label style={styles.label}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder} style={styles.input} required />
              </div>
            ))}
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: '80px' }} required />
          </div>
          <button type="submit" style={styles.submitBtn}>{editId ? 'Update Product' : 'Create Product'}</button>
        </form>
      )}

      {/* Products Table */}
      <div style={styles.tableWrap}>
        <div style={styles.tableHead}>
          <span>Image</span><span>Name</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
        </div>
        {products.map((p) => (
          <div key={p._id} style={styles.tableRow}>
            <img src={p.image} alt={p.name} style={styles.thumb} onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
            <span style={styles.productName}>{p.name}</span>
            <span style={styles.category}>{p.category}</span>
            <span style={styles.price}>₹{p.price.toLocaleString()}</span>
            <span style={{ color: p.countInStock > 0 ? '#4caf50' : '#e94560' }}>{p.countInStock}</span>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.6rem', fontWeight: 700, margin: 0 },
  addBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 },
  msg: { padding: '0.7rem 1rem', background: '#16213e', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#4caf50' },
  form: { background: '#16213e', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' },
  formTitle: { margin: '0 0 1rem', fontSize: '1.1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { color: '#bbb', fontSize: '0.8rem' },
  input: { background: '#0f0f1a', color: '#eee', border: '1px solid #2a2a4a', padding: '9px 12px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  submitBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 },
  tableWrap: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tableHead: { display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 70px 130px', padding: '0.5rem 1rem', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 70px 130px', background: '#16213e', padding: '0.7rem 1rem', borderRadius: '8px', alignItems: 'center', fontSize: '0.85rem' },
  thumb: { width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' },
  productName: { color: '#eee', fontWeight: 600 },
  category: { color: '#888' },
  price: { color: '#f5a623', fontWeight: 600 },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: { background: '#2196f3', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
  deleteBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
};

export default AdminProducts;
