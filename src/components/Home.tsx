import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StoryItem from './StoryItem';

const Home: React.FC = () => {
  // Set your wedding date here (Year, Month (0-11), Day, Hour, Minute, Second)
  const weddingDate = new Date(2026, 6, 25, 10, 0, 0).getTime(); // July 25, 2026, 10:00:00

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        // Wedding date has passed
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <>
      <div className="hero-section text-center d-flex flex-column justify-content-center align-items-center">
        <StoryItem><h1 className="display-3 text-white">Dimas & Niken</h1></StoryItem>
        <StoryItem delay="0.2s"><h2 className="text-white">Wedding Invitation</h2></StoryItem>
        <StoryItem delay="0.4s"><p className="lead text-white">Bergabunglah bersama kami merayakan hari istimewa kami!</p></StoryItem>

        <StoryItem delay="0.7s"><h3 className="text-white mt-5">Countdown</h3></StoryItem>
        <StoryItem delay="0.9s">
          <div className="d-flex justify-content-center gap-3 countdown-container">
            <div className="p-2 countdown-item" style={{ border: '2.5px solid #556B2F', borderRadius: '50px', minWidth: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)' }}>
              <h4>{countdown.days}</h4>
              <p>Hari</p>
            </div>
            <div className="p-2 countdown-item" style={{ border: '2.5px solid #556B2F', borderRadius: '50px', minWidth: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)' }}>
              <h4>{countdown.hours}</h4>
              <p>Jam</p>
            </div>
            <div className="p-2 countdown-item" style={{ border: '2.5px solid #556B2F', borderRadius: '50px', minWidth: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)' }}>
              <h4>{countdown.minutes}</h4>
              <p>Menit</p>
            </div>
            <div className="p-2 countdown-item" style={{ border: '2.5px solid #556B2F', borderRadius: '50px', minWidth: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)' }}>
              <h4>{countdown.seconds}</h4>
              <p>Detik</p>
            </div>
          </div>
        </StoryItem>
        <StoryItem delay="1.1s">
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <Link
              to="/rsvp-guestbook"
              className="btn btn-primary"
              style={{
                fontWeight: 500,
                fontSize: '0.85rem',
                borderRadius: '30px',
                padding: '7px 18px',
                boxShadow: '0 2px 12px rgba(85,107,47,0.10)',
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid #556B2F',
                color: '#fff',
                backdropFilter: 'blur(2px)',
                transition: 'background 0.2s, color 0.2s',
                letterSpacing: '0.5px',
              }}
            >
              Menuju RSVP & Buku Tamu
            </Link>
          </div>
        </StoryItem>
      </div>
    </>
  );
};

export default Home;
