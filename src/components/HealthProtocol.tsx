import React from 'react';
import StoryItem from './StoryItem';

const HealthProtocol: React.FC = () => {
  return (
    <div>
      <StoryItem><h2>Protokol Kesehatan</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Keselamatan dan kenyamanan Anda adalah prioritas utama kami. Kami mohon semua tamu untuk mematuhi protokol kesehatan berikut selama acara:</p></StoryItem>
      <StoryItem delay="0.4s">
        <ul>
          <li><strong>Penggunaan Masker:</strong> Mohon kenakan masker setiap saat, terutama di area dalam ruangan.</li>
          <li><strong>Sanitasi Tangan:</strong> Pembersih tangan akan disediakan di berbagai titik. Mohon gunakan secara teratur.</li>
          <li><strong>Jaga Jarak Sosial:</strong> Jaga jarak aman dari tamu lain jika memungkinkan.</li>
          <li><strong>Pengecekan Suhu:</strong> Pengecekan suhu akan dilakukan saat kedatangan. Tamu dengan suhu di atas [misalnya, 37.5°C] mungkin diminta untuk beristirahat atau mencari saran medis.</li>
          <li><strong>Tetap di Rumah Jika Tidak Sehat:</strong> Jika Anda merasa tidak sehat atau memiliki gejala sakit, mohon prioritaskan kesehatan Anda dan tetap di rumah. Kesehatan Anda lebih penting.</li>
        </ul>
      </StoryItem>
      <StoryItem delay="0.6s"><p>Terima kasih atas pengertian dan kerja sama Anda dalam menjadikan hari istimewa kami aman dan menyenangkan bagi semua.</p></StoryItem>
    </div>
  );
};

export default HealthProtocol;
