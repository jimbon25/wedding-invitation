import React, { useState } from 'react';
import Slider from 'react-slick';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import StoryItem from './StoryItem';

const Gallery: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  // You can replace these with your actual image paths
  const allImages = [
    { src: '/images/gallery/g1.webp' },
    { src: '/images/gallery/g2.webp' },
    { src: '/images/gallery/g3.webp' },
    { src: '/images/gallery/g4.webp' },
    { src: '/images/gallery/g7.webp' },
    { src: '/images/gallery/g8.webp' },
    { src: '/images/gallery/g9.webp' },
    { src: '/images/gallery/g10.webp' },
  ];

  const midPoint = Math.ceil(allImages.length / 2);
  const imagesTop = allImages.slice(0, midPoint);
  const imagesBottom = allImages.slice(midPoint);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const finalSettings = {
    ...settings,
    slidesToShow: 4,
  };

  const handleImageClick = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  return (
    <div>
      <StoryItem><h2>Galeri</h2></StoryItem>
      <StoryItem delay="0.2s"><p className="mb-4">Kumpulan momen berharga kami.</p></StoryItem>

      {!showGallery && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0' }}>
          <img src="/galeri.gif" alt="Galeri gif kiri" style={{ width: '68px', height: '68px', marginRight: '18px' }} />
          <button
            onClick={() => setShowGallery(true)}
            style={{
              background: '#fff',
              color: '#556B2F',
              border: '2px solid #556B2F',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '0.98em',
              fontWeight: 600,
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            className="gallery-btn"
          >
            Lihat Galeri
          </button>
          <img src="/galeri.gif" alt="Galeri gif kanan" style={{ width: '68px', height: '68px', marginLeft: '18px' }} />
        </div>
      )}

      {showGallery && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => setShowGallery(false)}
              style={{
                background: '#fff',
                color: '#556B2F',
                border: '2px solid #556B2F',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '0.95em',
                fontWeight: 600,
                fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              Tutup Galeri
            </button>
          </div>
          {/* Top Slider */}
          <StoryItem delay="0.4s">
            <Slider {...finalSettings}>
              {imagesTop.map((image, idx) => (
                <div key={idx} className="p-2" onClick={() => handleImageClick(idx)}>
                  <img src={image.src} className="img-fluid rounded shadow-sm" alt={`Couple's moment ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>
          </StoryItem>

          {/* Bottom Slider */}
          <StoryItem delay="0.6s">
            <Slider {...finalSettings}>
              {imagesBottom.map((image, idx) => (
                <div key={idx} className="p-2" onClick={() => handleImageClick(midPoint + idx)}>
                  <img src={image.src} className="img-fluid rounded shadow-sm" alt={`Couple's moment ${midPoint + idx + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>
          </StoryItem>

          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={allImages}
            index={index}
          />
        </>
      )}
    </div>
  );
};

export default Gallery;