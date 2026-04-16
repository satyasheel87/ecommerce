import React from 'react';

const Loader = () => (
  <div style={styles.wrapper}>
    <div style={styles.spinner}></div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', padding: '3rem' },
  spinner: {
    width: '48px', height: '48px',
    border: '4px solid #333',
    borderTop: '4px solid #e94560',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

export default Loader;
