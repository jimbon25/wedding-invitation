import React, { useState } from 'react';
import StoryItem from './StoryItem';

const GiftRegistry: React.FC = () => {
  const [showSaweria, setShowSaweria] = useState(false);

  return (
    <div>
      <StoryItem><h2>Daftar Hadiah</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Kehadiran Anda di pernikahan kami adalah hadiah terbesar. Namun, jika Anda ingin memberikan hadiah, kami telah menyiapkan beberapa opsi:</p></StoryItem>

      <StoryItem delay="0.4s"><h3>Hadiah Moneter:</h3></StoryItem>
      {/* ...existing code... */}
      <StoryItem delay="0.6s"><p>Hadiah moneter akan sangat kami hargai saat kami memulai kehidupan baru bersama. Anda dapat mengirimkan hadiah melalui transfer bank:</p></StoryItem>
      <StoryItem delay="0.8s">
        <ul>
          <li>
            <button
              style={{
                background: '#f7f7f7',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.98em',
                color: '#2d7cff',
                outline: 'none',
                marginRight: '10px',
                marginBottom: '2px',
                verticalAlign: 'middle',
              }}
              onClick={() => setShowSaweria((v) => !v)}
              aria-expanded={showSaweria}
              aria-controls="saweria-barcode"
            >
              {showSaweria ? 'Tutup Barcode Saweria' : 'Saweria (Klik untuk barcode)'}
            </button>
            {showSaweria && (
              <span id="saweria-barcode" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }}>
                <img src="/images/saweria.png" alt="Barcode Saweria" style={{ maxWidth: '180px', width: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <div style={{ fontSize: '0.85em', color: '#555', marginTop: '4px' }}>Scan barcode Saweria</div>
              </span>
            )}
          </li>
          <li><strong>Nama Bank:</strong> [Your Bank Name, e.g., Bank Central Asia (BCA)]</li>
          <li><strong>Nomor Rekening:</strong> [Your Account Number, e.g., 1234567890]</li>
          <li><strong>Atas Nama:</strong> Dimas Luis Aditya & Niken Aristania Fitri</li>
        </ul>
      </StoryItem>
    </div>
  );
};

export default GiftRegistry;
