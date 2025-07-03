import React from 'react';

const Modal = ({ children, onClose }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  }}>
    <div style={{ background: '#fff', borderRadius: 8, minWidth: 300, maxWidth: 500, boxShadow: '0 2px 8px #0002', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
      {children}
    </div>
  </div>
);

export default Modal;