import React from 'react';

interface CoverScreenProps {
  onOpenInvitation: () => void;
}

const CoverScreen: React.FC<CoverScreenProps> = ({ onOpenInvitation }) => {
  return (
    <div className="cover-screen">
      <div className="cover-content">
        <h1 className="cover-title">D & N</h1>
        <p className="cover-subtitle">Wedding Invitation</p>
        <button className="btn btn-lg btn-primary cover-button" onClick={onOpenInvitation}>
          Buka Undangan
        </button>
      </div>
    </div>
  );
};

export default CoverScreen;