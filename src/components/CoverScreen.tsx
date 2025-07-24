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
  // ...existing code...
  // Tampilkan 4 GIF dengan posisi dan animasi random
  function getRandomPosition() {
    // Hindari area tengah agar tidak bertumpuk dengan teks
    const top = `${Math.random() * 70 + 5}%`;
    const left = `${Math.random() * 80 + 5}%`;
    return { top, left };
  }
  function getRandomAnimation() {
    const floatY = `${3 + Math.random() * 2}s`;
    const floatX = `${5 + Math.random() * 2}s`;
    const rotate = `${6 + Math.random() * 4}s`;
    return `floatY ${floatY} ease-in-out infinite alternate, floatX ${floatX} ease-in-out infinite alternate, rotateGif ${rotate} linear infinite`;
  }
  function getRandomAnimationDelay() {
    return `${Math.random() * 4}s`;
  }

  return (
    <div className="cover-screen">
      {gifList.map((gif, idx) => {
        const pos = getRandomPosition();
        return (
          <img
            key={idx}
            src={gif}
            alt={`Floating GIF ${idx+1}`}
            className="floating-gif"
            style={{
              ...pos,
              animation: getRandomAnimation(),
              animationDelay: getRandomAnimationDelay(),
            }}
          />
        );
      })}
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