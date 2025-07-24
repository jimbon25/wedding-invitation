import React from 'react';
import StoryItem from './StoryItem';

const GiftRegistry: React.FC = () => {
  return (
    <div>
      <StoryItem><h2>Daftar Hadiah</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Kehadiran Anda di pernikahan kami adalah hadiah terbesar. Namun, jika Anda ingin memberikan hadiah, kami telah menyiapkan beberapa opsi:</p></StoryItem>

      <StoryItem delay="0.4s"><h3>Hadiah Moneter:</h3></StoryItem>
      <StoryItem delay="0.6s"><p>Hadiah moneter akan sangat kami hargai saat kami memulai kehidupan baru bersama. Anda dapat mengirimkan hadiah melalui transfer bank:</p></StoryItem>
      <StoryItem delay="0.8s">
        <ul>
          <li><strong>Nama Bank:</strong> [Your Bank Name, e.g., Bank Central Asia (BCA)]</li>
          <li><strong>Nomor Rekening:</strong> [Your Account Number, e.g., 1234567890]</li>
          <li><strong>Atas Nama:</strong> Dimas Luis Aditya & Niken Aristania Fitri</li>
        </ul>
      </StoryItem>

      

      

    </div>
  );
};

export default GiftRegistry;
