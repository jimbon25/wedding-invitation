import React from 'react';

interface ToastNotificationProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, message, type = 'success', onClose }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 20000,
        minWidth: 220,
        background: type === 'success' ? '#4BB543' : '#D32F2F',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: '1rem',
        fontWeight: 500,
        animation: 'fadeInToast 0.3s',
      }}
      role="alert"
      aria-live="assertive"
    >
      <span style={{ fontSize: 20 }}>
        {type === 'success' ? '✔️' : '❌'}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>
      <style>{`
        @keyframes fadeInToast {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ToastNotification;
