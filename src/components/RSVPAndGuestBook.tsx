import React from 'react';
import RSVPForm from './RSVPForm';
import GuestBook from './GuestBook';
import StoryItem from './StoryItem';

const RSVPAndGuestBook: React.FC = () => {
  return (
    <div>
      <StoryItem><h1>Konfirmasi Kehadiran & Buku Tamu</h1></StoryItem>
      <div className="row g-4 mt-3 align-items-stretch">
        <div className="col-12 col-lg-6 d-flex flex-column">
          <RSVPForm />
        </div>
        {/* Garis pemisah */}
        <div className="d-none d-lg-flex col-lg-1 justify-content-center align-items-stretch p-0">
          <div style={{ width: '2px', background: '#e0e0e0', height: '100%' }} />
        </div>
        <div className="d-block d-lg-none col-12">
          <hr style={{ borderTop: '2px solid #e0e0e0', margin: '32px 0' }} />
        </div>
        <div className="col-12 col-lg-5 d-flex flex-column">
          <GuestBook />
        </div>
      </div>
    </div>
  );
};

export default RSVPAndGuestBook;
