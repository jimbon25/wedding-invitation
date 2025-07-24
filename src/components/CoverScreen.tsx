import React, { useEffect, useState } from 'react';
import './CoverScreen.css';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Ambil nama tamu dari parameter URL 'to'
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  // Untuk slideshow GIF, bisa tambahkan lebih dari satu GIF di array ini
  const gifList = ['/cover.gif'];
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    if (gifList.length > 1) {
      const interval = setInterval(() => {
        setCurrentGif((prev) => (prev + 1) % gifList.length);
      }, 4000); // Ganti setiap 4 detik
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="cover-screen">
      <img
        src={gifList[currentGif]}
        alt="Floating GIF"
        className="floating-gif"
      />
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