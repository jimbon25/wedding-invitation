import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Home', to: '/', icon: 'bi-house-door-fill' },
  { label: 'RSVP', to: '/rsvp-guestbook', icon: 'bi-check-circle-fill' },
  { label: 'Galeri', to: '/gallery', icon: 'bi-image-fill' },
  { label: 'Cerita', to: '/our-story', icon: 'bi-book-fill' },
  { label: 'Hadiah', to: '/gift-info', icon: 'bi-gift-fill' },
  { label: 'Akomodasi', to: '/accommodation-info', icon: 'bi-car-front-fill' },
];

interface FloatingMenuProps {
  darkMode: boolean;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [mini, setMini] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Drag logic (mouse)
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.body.style.userSelect = 'none';
  };

  // Drag logic (touch/mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!dragging) return;
    const touch = e.touches[0];
    setPos({
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    });
  };
  const onTouchEnd = () => {
    setDragging(false);
  };
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  }, [dragging]);
  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onMouseMove]);

  // Mode mini: auto shrink jika idle
  React.useEffect(() => {
    if (open || dragging) {
      setMini(false);
      return;
    }
    const timer = setTimeout(() => setMini(true), 5000); // 5 detik idle
    return () => clearTimeout(timer);
  }, [open, dragging]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        userSelect: 'none',
        transition: dragging ? 'none' : 'box-shadow 0.2s, left 0.22s, top 0.22s',
      }}
    >
      {/* Floating button */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setMini(false)}
        style={{
          width: mini ? 42 : 54,
          height: mini ? 42 : 54,
          borderRadius: '50%',
          background: darkMode
            ? 'linear-gradient(135deg, #232d2b 0%, #181A1B 100%)'
            : 'linear-gradient(135deg, #7ed957 0%, #556B2F 100%)',
          boxShadow: open
            ? (darkMode ? '0 4px 16px rgba(30,30,30,0.28)' : '0 4px 16px rgba(85,107,47,0.18)')
            : (darkMode ? '0 2px 8px rgba(30,30,30,0.18)' : '0 2px 8px rgba(0,0,0,0.12)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          border: darkMode ? '2.5px solid #EEE' : '2.5px solid #fff',
          color: darkMode ? '#EEE' : '#fff',
          fontSize: mini ? 22 : 28,
          fontWeight: 700,
          transition: 'background 0.2s, box-shadow 0.2s, width 0.22s, height 0.22s, font-size 0.22s',
          backdropFilter: 'blur(2px)',
          position: 'relative',
          touchAction: 'none',
        }}
      >
        <i
          className={`bi bi-grid-3x3-gap-fill${open ? ' floating-menu-rotate' : ''}`}
          style={{ fontSize: mini ? 22 : 28, fontWeight: 700, userSelect: 'none', transition: 'transform 0.32s cubic-bezier(.42,1.6,.58,1), font-size 0.22s' }}
        ></i>
      </div>
      {/* Menu pop-up */}
      {open && (
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 0,
            minWidth: 120,
            background: darkMode ? 'rgba(24,26,27,0.96)' : 'rgba(255,255,255,0.82)',
            color: darkMode ? '#EEE' : '#556B2F',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            boxShadow: darkMode ? '0 4px 24px rgba(30,30,30,0.18)' : '0 4px 24px rgba(85,107,47,0.13)',
            padding: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: darkMode ? '1.5px solid #333' : '1.5px solid #e0e0e0',
            animation: 'scaleFadeInMenu 0.22s cubic-bezier(.42,1.6,.58,1) both',
            transformOrigin: 'left top',
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.to}
              onClick={e => {
                // Ripple effect
                const btn = e.currentTarget;
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.className = 'floating-menu-ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.nativeEvent.offsetX - size / 2) + 'px';
                ripple.style.top = (e.nativeEvent.offsetY - size / 2) + 'px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 500);
                setOpen(false);
                navigate(item.to);
              }}
              className="floating-menu-item-btn"
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#EEE' : '#556B2F',
                fontWeight: 600,
                fontSize: 16,
                padding: '10px 18px',
                textAlign: 'left',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'background 0.18s, box-shadow 0.18s',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: 18, marginRight: 6, minWidth: 18 }}></i>
              {item.label}
            </button>
          ))}
        </div>
      )}
      {/* Keyframes for fadeInMenu */}
      <style>{`
        @keyframes scaleFadeInMenu {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.85);
          }
          60% {
            opacity: 1;
            transform: translateY(-4px) scale(1.04);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .floating-menu-item-btn:hover, .floating-menu-item-btn:focus {
          background: ${darkMode ? 'rgba(80,80,80,0.18)' : 'rgba(85,107,47,0.08)'};
          box-shadow: 0 2px 12px 0 rgba(85,107,47,0.18), 0 0 0 2px #d0e6c1;
          outline: none;
        }
        .floating-menu-rotate {
          transform: rotate(90deg) scale(1.08);
        }
        .floating-menu-ripple {
          position: absolute;
          border-radius: 50%;
          background: ${darkMode ? 'rgba(80,80,80,0.28)' : 'rgba(85,107,47,0.18)'};
          transform: scale(0);
          animation: floatingMenuRipple 0.5s linear;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes floatingMenuRipple {
          to {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingMenu;
