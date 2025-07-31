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
        {/* Divider animasi SVG */}
        <div className="d-none d-lg-flex col-lg-1 justify-content-center align-items-stretch p-0">
          <svg width="2" height="100%" style={{minHeight:'320px',height:'100%'}} viewBox="0 0 2 320">
            <rect x="0" y="0" width="2" height="320" rx="1" fill="#e0e0e0">
              <animate attributeName="height" from="0" to="320" dur="1.1s" fill="freeze" />
            </rect>
          </svg>
        </div>
        <div className="d-block d-lg-none col-12" style={{textAlign:'center'}}>
          <svg width="120" height="12" viewBox="0 0 120 12" style={{overflow:'visible',margin:'32px 0'}}>
            <rect x="0" y="5" width="120" height="2" rx="1" fill="#e0e0e0">
              <animate attributeName="width" from="0" to="120" dur="1.1s" fill="freeze" />
            </rect>
          </svg>
        </div>
        <div className="col-12 col-lg-5 d-flex flex-column">
          <GuestBook />
        </div>
      </div>
    </div>
  );
};

export default RSVPAndGuestBook;
