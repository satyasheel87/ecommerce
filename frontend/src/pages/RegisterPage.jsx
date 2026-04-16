import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match!');
    }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account 🎉</h1>
        <p style={styles.sub}>Join ShopEasy today</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: 'Full Name',         name: 'name',            type: 'text',     placeholder: 'John Doe' },
            { label: 'Email Address',     name: 'email',           type: 'email',    placeholder: 'you@example.com' },
            { label: 'Password',          name: 'password',        type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password',  name: 'confirmPassword', type: 'password', placeholder: '••••••••' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type} name={name} required
                value={form[name]} onChange={handleChange}
                style={styles.input} placeholder={placeholder}
              />
            </div>
          ))}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#0f0f1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
  },
  card: {
    background: '#16213e', borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
  },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.3rem' },
  sub:   { color: '#888', marginBottom: '1.5rem' },
  error: { background: 'rgba(233,69,96,0.15)', color: '#e94560', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form:  { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#bbb', fontSize: '0.85rem', fontWeight: 600 },
  input: {
    background: '#0f0f1a', color: '#eee', border: '1px solid #2a2a4a',
    padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
  },
  btn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '13px', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem',
  },
  switchText: { textAlign: 'center', color: '#888', marginTop: '1.5rem', fontSize: '0.9rem' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 600 },
};

export default RegisterPage;
