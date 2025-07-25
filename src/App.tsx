import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll detection

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
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the mobile menu
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Cek preferensi user di localStorage
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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

  // Touch event handlers for swipe-to-close
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    setTouchCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeDistance = touchCurrentX - touchStartX;
    // Define a threshold for closing the menu (e.g., 50 pixels to the right)
    const swipeThreshold = 50;

    if (swipeDistance > swipeThreshold && isOpen) {
      setIsOpen(false); // Close the menu
    }
    // Reset touch positions
    setTouchStartX(0);
    setTouchCurrentX(0);
  }, [touchCurrentX, touchStartX, isOpen]);

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

    // Handle scroll for navbar transparency
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust this value as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the class and event listener when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Attach touch event listeners to the menu when it's open
  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement && isOpen) {
      menuElement.addEventListener('touchstart', handleTouchStart);
      menuElement.addEventListener('touchmove', handleTouchMove);
      menuElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener('touchstart', handleTouchStart as EventListener);
        menuElement.removeEventListener('touchmove', handleTouchMove as EventListener);
        menuElement.removeEventListener('touchend', handleTouchEnd as EventListener);
      }
    };
  }, [isOpen, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <Router>
      {!isInvitationOpened && <CoverScreen onOpenInvitation={handleOpenInvitation} />}

      <div style={{ display: isInvitationOpened ? 'block' : 'none' }}>
        {isOpen && <div className="menu-overlay" onClick={toggleNavbar}></div>}
        <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container-fluid d-flex align-items-center">
            <NavLink className="navbar-brand" to="/">Dimas & Niken</NavLink>
            <button className="navbar-toggler" type="button" onClick={toggleNavbar} aria-expanded={isOpen}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div ref={menuRef} className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} style={{ transform: isOpen && touchStartX !== 0 ? `translateX(${Math.max(0, touchCurrentX - touchStartX)}px)` : 'none' }}>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <img
                  src="/navbar-gif.gif"
                  alt="Cute Anime Girl"
                  className="navbar-gif"
                  style={{
                    height: '48px',
                    margin: '4px 8px 4px 0',
                    borderRadius: '8px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/" onClick={() => setIsOpen(false)}><i className="bi bi-house-door-fill me-2"></i>Beranda</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/our-story" onClick={() => setIsOpen(false)}><i className="bi bi-book-fill me-2"></i>Kisah Kami</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/event-details" onClick={() => setIsOpen(false)}><i className="bi bi-calendar-event-fill me-2"></i>Detail Acara</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/gallery" onClick={() => setIsOpen(false)}><i className="bi bi-image-fill me-2"></i>Galeri</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/rsvp" onClick={() => setIsOpen(false)}><i className="bi bi-check-circle-fill me-2"></i>Konfirmasi Kehadiran</NavLink>
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
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/gift-info" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}><i className="bi bi-gift me-2"></i>Informasi Hadiah</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/guestbook" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}><i className="bi bi-journal-text me-2"></i>Buku Tamu</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/accommodation-info" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}><i className="bi bi-car-front-fill me-2"></i>Akomodasi & Transportasi</NavLink></li>
                      <li><NavLink className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")} to="/gift-registry" onClick={() => { setIsOpen(false); setIsOtherDropdownOpen(false); }}><i className="bi bi-gift-fill me-2"></i>Daftar Hadiah</NavLink></li>
                    </ul>
                  )}
                </li>
              </ul>
              <div className="d-flex ms-auto align-items-center">
                <button className={`btn btn-sm btn-outline-primary ms-2 music-icon-container ${isPlaying ? 'spinning' : ''}`} onClick={togglePlay}>
                  <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} music-icon`}></i>
                </button>
                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={handleShare}>
                  Bagikan
                </button>
                <button
                  className={`btn btn-sm ms-2 ${darkMode ? 'btn-dark' : 'btn-light'}`}
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className={`bi ${darkMode ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'}`}></i>
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