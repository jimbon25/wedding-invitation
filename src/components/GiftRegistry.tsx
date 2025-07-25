import React, { useState } from 'react';
import StoryItem from './StoryItem';

const GiftRegistry: React.FC = () => {
  const [showSaweria, setShowSaweria] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <style>{`
        .gift-list {
          list-style-type: disc;
        }
        @media (max-width: 600px) {
          .gift-list {
            padding-left: 18px;
            list-style-type: disc;
          }
          .gift-list li {
            display: block !important;
            margin-bottom: 12px;
          }
          .gift-list .rekening-row {
            flex-direction: row !important;
            align-items: center !important;
          }
          .gift-list .rekening-row .rekening-number {
            margin-bottom: 0 !important;
          }
          .gift-list .rekening-row button {
            margin-top: 0 !important;
            margin-left: 2px !important;
            width: auto;
            justify-content: flex-start;
          }
          .gift-list .rekening-row span {
            margin-left: 6px !important;
            margin-right: 6px !important;
          }
        }
      `}</style>
      <StoryItem><h2>Daftar Hadiah</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Kehadiran Anda di pernikahan kami adalah hadiah terbesar. Namun, jika Anda ingin memberikan hadiah, kami telah menyiapkan beberapa opsi:</p></StoryItem>

      <StoryItem delay="0.4s"><h3>Hadiah Moneter:</h3></StoryItem>
      {/* ...existing code... */}
      <StoryItem delay="0.6s"><p>Hadiah moneter akan sangat kami hargai saat kami memulai kehidupan baru bersama. Anda dapat mengirimkan hadiah melalui transfer bank:</p></StoryItem>
      <StoryItem delay="0.8s">
        <ul className="gift-list" style={{ paddingLeft: '18px' }}>
          <li>
            <button
              style={{
                background: 'none',
                border: 'none',
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
          <li><strong>Nama Bank:</strong> BCA</li>
          <li className="rekening-row" style={{ display: 'flex', alignItems: 'center' }}>
            <strong>Nomor Rekening:</strong>
            <span className="rekening-number" style={{ marginLeft: '6px', marginRight: '6px' }}>123456789</span>
            <button
              onClick={handleCopy}
              title="Copy nomor rekening"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d7cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            </button>
            {copied && <span style={{ color: '#2d7cff', fontSize: '0.9em', marginLeft: '8px' }}>Tersalin!</span>}
          </li>
          <li><strong>Atas Nama:</strong> Dimas Luis Aditya & Niken Aristania Fitri</li>
        </ul>
      </StoryItem>
    </div>
  );
};

export default GiftRegistry;
