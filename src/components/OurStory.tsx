import React, { useState, useRef } from 'react';
import StoryItem from './StoryItem';

const OurStory: React.FC = () => {
  const videoSrc = "/videos/our.mp4";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div>
      <StoryItem><h2>Kisah Kami</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Setiap kisah cinta memiliki awal yang unik, dan kisah kami dimulai dengan cara yang sederhana namun tak terlupakan. Dimas dan Niken pertama kali bertemu di sebuah acara komunitas, di mana percikan pertama mulai terasa di antara tawa dan obrolan ringan.</p></StoryItem>
      <StoryItem delay="0.4s"><p>Seiring berjalannya waktu, persahabatan kami tumbuh menjadi sesuatu yang lebih dalam. Kami menemukan banyak kesamaan, mulai dari hobi hingga impian masa depan. Setiap momen yang kami habiskan bersama terasa begitu berarti, dan kami tahu bahwa kami telah menemukan belahan jiwa masing-masing.</p></StoryItem>
      <StoryItem delay="0.6s"><p>Hingga pada suatu hari yang indah, Dimas melamar Niken di tempat yang memiliki makna khusus bagi kami berdua. Dengan hati yang penuh kebahagiaan, Niken menerima lamaran tersebut, menandai babak baru dalam perjalanan cinta kami.</p></StoryItem>
      <StoryItem delay="0.8s"><p>Kini, kami siap untuk melangkah ke jenjang pernikahan, membangun keluarga, dan menciptakan lebih banyak kenangan indah bersama. Kami sangat antusias untuk berbagi kebahagiaan ini dengan Anda semua.</p></StoryItem>

      <div className="mt-5">
        <StoryItem delay="1s"><h3>Perjalanan Kami dalam Video</h3></StoryItem>
        <StoryItem delay="1.2s">
          <div className="video-container embed-responsive embed-responsive-16by9" style={{ height: '400px' }}>
            <video ref={videoRef} muted={isMuted} playsInline className="embed-responsive-item" style={{ width: '100%', height: '100%' }} poster="/images/g9.webp">
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-controls">
              <button className="btn btn-light btn-lg video-play-button" onClick={togglePlay}>
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
              </button>
              <button className="btn btn-light btn-sm video-mute-button" onClick={toggleMute}>
                <i className={`bi ${isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
              </button>
            </div>
          </div>
        </StoryItem>
        <StoryItem delay="1.4s">
          <p className="mt-2 text-muted">
          </p>
        </StoryItem>
      </div>
    </div>
  );
};

export default OurStory;
