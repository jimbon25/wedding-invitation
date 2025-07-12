import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-5">
      <div className="container p-4">
        <div className="text-center">
          {/* Social Media Icons */}
          <div className="social-icons mb-3">
            <a href="https://instagram.com/your_instagram" target="_blank" rel="noopener noreferrer" className="mx-2">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://facebook.com/your_facebook" target="_blank" rel="noopener noreferrer" className="mx-2">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://twitter.com/your_twitter" target="_blank" rel="noopener noreferrer" className="mx-2">
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem', color: 'var(--light-text-color)' }}>&copy; {new Date().getFullYear()} Dimas & Niken Wedding Invitation. All Rights Reserved.</p>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem', color: 'var(--light-text-color)' }}>Designed with ❤️ for a beautiful beginning.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
