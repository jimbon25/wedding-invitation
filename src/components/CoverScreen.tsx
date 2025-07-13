import React from 'react';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  // Get guest name from URL query parameter `to`
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');

  return (
    <div className="cover-screen">
      <div className="cover-content text-center">
        <p className="cover-subtitle">The Wedding Of</p>
        <h1 className="cover-title">Dimas & Niken</h1>
        
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