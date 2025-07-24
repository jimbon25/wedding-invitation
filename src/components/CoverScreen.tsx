import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './CoverScreen.css';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Ambil nama tamu dari parameter URL 'to'
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  // Tampilkan 4 GIF dengan posisi dan animasi random yang berubah dinamis
  const gifList = useMemo(() => ['/cover.gif', '/cover.gif', '/cover.gif', '/cover.gif'], []);
  type GifState = {
    top: string;
    left: string;
    animation: string;
    animationDelay: string;
  };
  const getRandomGifState = useCallback((): GifState => {
    const top = `${Math.random() * 70 + 5}%`;
    const left = `${Math.random() * 80 + 5}%`;
    const floatY = `${3 + Math.random() * 2}s`;
    const floatX = `${5 + Math.random() * 2}s`;
    const rotate = `${6 + Math.random() * 4}s`;
    const animation = `floatY ${floatY} ease-in-out infinite alternate, floatX ${floatX} ease-in-out infinite alternate, rotateGif ${rotate} linear infinite`;
    const animationDelay = `${Math.random() * 4}s`;
    return { top, left, animation, animationDelay };
  }, []);

  const [gifStates, setGifStates] = useState<GifState[]>(() => gifList.map(() => getRandomGifState()));

  useEffect(() => {
    const interval = setInterval(() => {
      setGifStates(gifList.map(() => getRandomGifState()));
    }, 3000);
    return () => clearInterval(interval);
  }, [gifList, getRandomGifState]);

  return (
    <div className="cover-screen">
      {gifList.map((gif, idx) => (
        <img
          key={idx}
          src={gif}
          alt={`Floating GIF ${idx+1}`}
          className="floating-gif"
          style={{
            top: gifStates[idx].top,
            left: gifStates[idx].left,
            animation: gifStates[idx].animation,
            animationDelay: gifStates[idx].animationDelay,
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