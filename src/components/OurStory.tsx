import React, { useState, useRef } from 'react';
import StoryItem from './StoryItem';
import { useLanguage } from '../utils/LanguageContext';

const OurStory: React.FC = () => {
  const { language } = useLanguage(); // Removed unused 't'
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

  // Content based on language
  const storyContent = language === 'en' ? {
    title: "Our Story",
    paragraph1: "Every love story has a unique beginning, and ours started in a simple yet unforgettable way. Dimas and Niken first met at a community event, where the first spark began to be felt amidst laughter and light conversation.",
    paragraph2: "As time went by, our friendship grew into something deeper. We found many similarities, from hobbies to future dreams. Every moment we spent together felt so meaningful, and we knew that we had found each other's soulmates.",
    paragraph3: "Until one beautiful day, Dimas proposed to Niken at a place that has special meaning for both of us. With a heart full of happiness, Niken accepted the proposal, marking a new chapter in our love journey.",
    paragraph4: "Now, we are ready to step into marriage, build a family, and create more beautiful memories together. We are very excited to share this happiness with all of you.",
    videoTitle: "Our Journey in Video"
  } : {
    title: "Kisah Kami",
    paragraph1: "Setiap kisah cinta memiliki awal yang unik, dan kisah kami dimulai dengan cara yang sederhana namun tak terlupakan. Dimas dan Niken pertama kali bertemu di sebuah acara komunitas, di mana percikan pertama mulai terasa di antara tawa dan obrolan ringan.",
    paragraph2: "Seiring berjalannya waktu, persahabatan kami tumbuh menjadi sesuatu yang lebih dalam. Kami menemukan banyak kesamaan, mulai dari hobi hingga impian masa depan. Setiap momen yang kami habiskan bersama terasa begitu berarti, dan kami tahu bahwa kami telah menemukan belahan jiwa masing-masing.",
    paragraph3: "Hingga pada suatu hari yang indah, Dimas melamar Niken di tempat yang memiliki makna khusus bagi kami berdua. Dengan hati yang penuh kebahagiaan, Niken menerima lamaran tersebut, menandai babak baru dalam perjalanan cinta kami.",
    paragraph4: "Kini, kami siap untuk melangkah ke jenjang pernikahan, membangun keluarga, dan menciptakan lebih banyak kenangan indah bersama. Kami sangat antusias untuk berbagi kebahagiaan ini dengan Anda semua.",
    videoTitle: "Perjalanan Kami dalam Video"
  };
  
  return (
    <div>
      <StoryItem><h2>{storyContent.title}</h2></StoryItem>
      <StoryItem delay="0.2s"><p>{storyContent.paragraph1}</p></StoryItem>
      <StoryItem delay="0.4s"><p>{storyContent.paragraph2}</p></StoryItem>
      <StoryItem delay="0.6s"><p>{storyContent.paragraph3}</p></StoryItem>
      <StoryItem delay="0.8s"><p>{storyContent.paragraph4}</p></StoryItem>

      <div className="mt-5">
        <StoryItem delay="1s"><h3>{storyContent.videoTitle}</h3></StoryItem>
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
