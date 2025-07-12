import React from 'react';
import StoryItem from './StoryItem';
import { Link } from 'react-router-dom';

const GiftInfo: React.FC = () => {
  return (
    <div>
      <StoryItem><h2>Informasi Hadiah</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Kehadiran Anda di hari bahagia kami adalah hadiah terbesar. Namun, jika Anda berkeinginan untuk memberikan tanda kasih, kami sangat menghargai dukungan Anda.</p></StoryItem>
      <StoryItem delay="0.4s"><p>Untuk detail mengenai opsi hadiah, termasuk informasi hadiah moneter, silakan kunjungi halaman <Link to="/gift-registry">Daftar Hadiah</Link> kami.</p></StoryItem>
    </div>
  );
};

export default GiftInfo;