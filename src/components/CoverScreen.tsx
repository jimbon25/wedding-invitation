import React from 'react';
import './CoverScreen.css';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Ambil nama tamu dari parameter URL 'to'
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  // Tampilkan 4 GIF dengan posisi berbeda
  const gifList = ['/cover.gif', '/cover.gif', '/cover.gif', '/cover.gif'];
  const gifPositions = [
    { style: { top: '18%', left: '25%', animation: 'floatY 3.5s ease-in-out infinite alternate, floatX 6s ease-in-out infinite alternate' } },
    { style: { top: '30%', left: '70%', animation: 'floatY 4s ease-in-out infinite alternate, floatX 5.5s ease-in-out infinite alternate-reverse' } },
    { style: { top: '60%', left: '35%', animation: 'floatY 3.2s ease-in-out infinite alternate-reverse, floatX 6.5s ease-in-out infinite alternate' } },
    { style: { top: '75%', left: '65%', animation: 'floatY 4.2s ease-in-out infinite alternate, floatX 5.2s ease-in-out infinite alternate-reverse' } },
  ];

  return (
    <div className="cover-screen">
      {gifList.map((gif, idx) => (
        <img
          key={idx}
          src={gif}
          alt={`Floating GIF ${idx+1}`}
          className="floating-gif"
          style={gifPositions[idx].style}
        />
      ))}
      <div className="cover-content text-center">
        <p className="cover-subtitle">The Wedding Of</p>
        <h1 className="cover-title">D & N</h1>
        {guestName && (
          <div className="guest-info mt-4">
            <p className="mb-0">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h2 className="guest-name">{guestName.replace(/\+/g, ' ')}</h2>
          </div>
        )}
        <button className="btn btn-lg btn-primary cover-button mt-5" onClick={onOpenInvitation}>
          Buka Undangan
        </button>
      </div>
    </div>
  );
};

export default CoverScreen;