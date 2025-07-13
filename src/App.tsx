import React, { useState, useRef, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import MainContentWrapper from './components/MainContentWrapper';
import CoverScreen from './components/CoverScreen';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isInvitationOpened, setIsInvitationOpened] = useState(false); // New state for cover screen

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenInvitation = () => {
    setIsInvitationOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOtherDropdownOpen, setIsOtherDropdownOpen] = useState(false); // New state for 'Lainnya' dropdown

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    // Close 'Lainnya' dropdown if main navbar is closing
    if (isOpen) {
      setIsOtherDropdownOpen(false);
    }
  };

  const toggleOtherDropdown = () => {
    setIsOtherDropdownOpen(!isOtherDropdownOpen);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Undangan Pernikahan',
      text: 'Anda diundang ke pernikahan Dimas & Niken!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Tautan disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // values from 0 to 3000, with step 50ms
      once: true, // whether animation should happen only once - while scrolling down
    });

    // Add/remove no-scroll class to body based on menu open state
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Clean up the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  return (
    <Router>
      {!isInvitationOpened && <CoverScreen onOpenInvitation={handleOpenInvitation} />}

      <div style={{ display: isInvitationOpened ? 'block' : 'none' }}>
        {isOpen && <div className="menu-overlay" onClick={toggleNavbar}></div>}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container-fluid d-flex align-items-center">
            <NavLink className="navbar-brand" to="/">Dimas & Niken</NavLink>
            <button className="navbar-toggler" type="button" onClick={toggleNavbar} aria-expanded={isOpen}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/" onClick={() => setIsOpen(false)}>Beranda</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/our-story" onClick={() => setIsOpen(false)}>Kisah Kami</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/event-details" onClick={() => setIsOpen(false)}>Detail Acara</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/gallery" onClick={() => setIsOpen(false)}>Galeri</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/rsvp" onClick={() => setIsOpen(false)}>Konfirmasi Kehadiran</NavLink>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link dropdown-toggle ${isOtherDropdownOpen ? 'active' : ''}`}
                    type="button"
                    id="navbarDropdown"
                    onClick={toggleOtherDropdown}
                    aria-expanded={isOtherDropdownOpen}
                  >
                    Lainnya
                  </button>
                  {isOtherDropdownOpen && (
                    <ul className="dropdown-menu show" aria-labelledby="navbarDropdown">
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/gift-info" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}>Informasi Hadiah</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/guestbook" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}>Buku Tamu</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/health-protocol" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}>Protokol Kesehatan</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/accommodation-info" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}>Akomodasi & Transportasi</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/gift-registry" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}>Daftar Hadiah</NavLink></li>
                    </ul>
                  )}
                </li>
              </ul>
              <div className="d-flex ms-auto">
                <button className={`btn btn-sm btn-outline-primary ms-2 music-icon-container ${isPlaying ? 'spinning' : ''}`} onClick={togglePlay}>
                  <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} music-icon`}></i>
                </button>
                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={handleShare}>
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </nav>

        <MainContentWrapper />

        <audio ref={audioRef} loop>
          {/* Replace with your actual music file URL */}
          <source src="/music/wedding-joy-189888.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
};

export default App;