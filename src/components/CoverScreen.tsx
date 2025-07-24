import React from 'react';
import './CoverScreen.css';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Ambil nama tamu dari parameter URL 'to'
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  // Tampilkan 4 GIF di sudut-sudut
  const gifList = ['/cover.gif', '/cover.gif', '/cover.gif', '/cover.gif'];
  const corners = [
    { top: '5%', left: '5%' },
    { top: '5%', right: '5%' },
    { bottom: '5%', left: '5%' },
    { bottom: '5%', right: '5%' },
  ];
  function getRandomAnimationDelay() {
    return `${Math.random() * 4}s`;
  }

  return (
    <div className="cover-screen">
      {gifList.map((gif, idx) => (
        <img
          key={idx}
          src={gif}
          alt={`Floating GIF ${idx+1}`}
          className="floating-gif"
          style={{
            ...corners[idx],
            animationDelay: getRandomAnimationDelay(),
          }}
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