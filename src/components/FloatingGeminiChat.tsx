import React, { useState } from 'react';
import GeminiChat from './GeminiChat';

const FloatingGeminiChat: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Gemini Icon Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 9999,
          background: '#fff',
          border: '2.5px solid #9CAF88',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 12px rgba(156,175,136,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          animation: 'floatGemini 2.5s ease-in-out infinite alternate',
        }}
        aria-label="Buka chat Gemini"
      >
        {/* Gemini Icon SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#9CAF88" />
          <ellipse cx="16" cy="16" rx="10" ry="6" fill="#fff" fillOpacity="0.85" />
          <ellipse cx="16" cy="16" rx="6" ry="10" fill="#fff" fillOpacity="0.7" />
          <circle cx="16" cy="16" r="4.5" fill="#9CAF88" />
        </svg>
      </button>
      {/* Bubble Chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 90,
            zIndex: 10000,
            animation: 'fadeInGemini 0.3s',
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: -12,
                right: -12,
                background: '#fff',
                border: '1.5px solid #9CAF88',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(156,175,136,0.13)',
                fontWeight: 700,
                color: '#9CAF88',
                fontSize: 18,
              }}
              aria-label="Tutup chat"
            >
              ×
            </button>
            <GeminiChat />
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes floatGemini {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
        @keyframes fadeInGemini {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FloatingGeminiChat;
