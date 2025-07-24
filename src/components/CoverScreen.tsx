import React, { useMemo } from 'react';
import './CoverScreen.css';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Ambil nama tamu dari parameter URL 'to'
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  // Tampilkan 4 GIF di sudut layar, animasi smooth tanpa flicker
  const gifList = useMemo(() => ['/cover.gif', '/cover.gif', '/cover.gif', '/cover.gif'], []);
  const gifPositions = [
    { top: '2%', left: '2%' },
    { top: '2%', right: '2%' },
    { bottom: '2%', left: '2%' },
    { bottom: '2%', right: '2%' },
  ];
  // Buat parameter animasi random untuk tiap GIF
  function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  const gifAnimParams = useMemo(() => (
    Array(4).fill(0).map(() => ({
      floatY: getRandomFloat(20, 60), // px
      floatYDuration: getRandomFloat(2.5, 5), // s
      rotateDuration: getRandomFloat(8, 16), // s
      delay: `${getRandomFloat(0, 2)}s`,
      direction: Math.random() > 0.5 ? 'normal' : 'reverse',
    }))
  ), []);

  return (
    <div className="cover-screen">
      {gifList.map((gif, idx) => (
        <img
          key={idx}
          src={gif}
          alt={`Floating GIF ${idx+1}`}
          className="floating-gif"
          style={{
            ...gifPositions[idx],
            animation: `floatY${idx} ${gifAnimParams[idx].floatYDuration}s ease-in-out infinite alternate ${gifAnimParams[idx].direction}, rotateGif${idx} ${gifAnimParams[idx].rotateDuration}s linear infinite`,
            animationDelay: gifAnimParams[idx].delay,
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