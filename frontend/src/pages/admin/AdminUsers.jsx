import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../../utils/api';
import Loader from '../../components/common/Loader';

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  const fetchUsers = async () => {
    const { data } = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setMsg('✅ User deleted');
    fetchUsers();
  };

  const handleToggleAdmin = async (user) => {
    await updateUser(user._id, { isAdmin: !user.isAdmin });
    setMsg(`✅ ${user.name} is now ${!user.isAdmin ? 'an Admin' : 'a regular User'}`);
    fetchUsers();
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Manage Users</h1>
      <p style={styles.count}>{users.length} registered users</p>
      {msg && <p style={styles.msg}>{msg}</p>}
      <div style={styles.tableWrap}>
        <div style={styles.tableHead}>
          <span>Name</span><span>Email</span><span>Role</span><span>Joined</span><span>Actions</span>
        </div>
        {users.map((user) => (
          <div key={user._id} style={styles.tableRow}>
            <span style={styles.name}>{user.name}</span>
            <span style={styles.email}>{user.email}</span>
            <span style={user.isAdmin ? styles.admin : styles.regular}>
              {user.isAdmin ? '👑 Admin' : '👤 User'}
            </span>
            <span style={styles.date}>{new Date(user.createdAt).toLocaleDateString()}</span>
            <div style={styles.actions}>
              <button onClick={() => handleToggleAdmin(user)} style={styles.toggleBtn}>
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f0f1a', minHeight: '100vh', padding: '2rem', color: '#eee' },
  title: { fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.3rem' },
  count: { color: '#888', marginBottom: '1rem', fontSize: '0.9rem' },
  msg: { background: '#16213e', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#4caf50', fontSize: '0.9rem' },
  tableWrap: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tableHead: { display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px 200px', padding: '0.5rem 1rem', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px 200px', background: '#16213e', padding: '0.8rem 1rem', borderRadius: '8px', alignItems: 'center', fontSize: '0.85rem' },
  name: { color: '#eee', fontWeight: 600 },
  email: { color: '#aaa' },
  admin: { color: '#f5a623', fontWeight: 600 },
  regular: { color: '#888' },
  date: { color: '#666' },
  actions: { display: 'flex', gap: '0.5rem' },
  toggleBtn: { background: '#2196f3', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' },
  deleteBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' },
};

export default AdminUsers;
