import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">Memuat Undangan...</p>
    </div>
  );
};

export default LoadingScreen;