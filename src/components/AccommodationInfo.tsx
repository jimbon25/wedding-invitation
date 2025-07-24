import React from 'react';
import StoryItem from './StoryItem';

const AccommodationInfo: React.FC = () => {
  return (
    <div>
      <StoryItem><h2>Akomodasi & Transportasi</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Untuk tamu-tamu tercinta kami yang bepergian dari luar kota, berikut adalah beberapa rekomendasi akomodasi dan transportasi:</p></StoryItem>

      <StoryItem delay="0.4s"><h3>Rekomendasi Akomodasi:</h3></StoryItem>
      <StoryItem delay="0.6s">
        <ul>
          <li>
            <strong>Hotel A</strong><br />
            Address: [Hotel A Address]<br />
            Phone: [Hotel A Phone]<br />
            Website: <span className="link-like">[Hotel A Website]</span><br />
            Notes: [e.g., 5-star hotel, close to venue]
          </li>
          <li className="mt-3">
            <strong>Hotel B</strong><br />
            Address: [Hotel B Address]<br />
            Phone: [Hotel B Phone]<br />
            Website: <span className="link-like">[Hotel B Website]</span><br />
            Notes: [e.g., Budget-friendly, good reviews]
          </li>
        </ul>
      </StoryItem>

      <StoryItem delay="0.8s"><h3>Panduan Transportasi:</h3></StoryItem>
      <StoryItem delay="1s"><p>The wedding venue is easily accessible by various modes of transportation:</p></StoryItem>
      <StoryItem delay="1.2s">
        <ul>
          <li>
            <strong>Dengan Mobil:</strong> Tersedia banyak tempat parkir di lokasi acara. Anda bisa menggunakan aplikasi ride-hailing seperti Grab atau Gojek.
          </li>
          <li className="mt-3">
            <strong>Dengan Transportasi Umum:</strong> [misalnya, Stasiun kereta/halte bus terdekat dan cara menuju lokasi dari sana].
          </li>
          <li className="mt-3">
            <strong>Transfer Bandara:</strong> Untuk tamu yang terbang, kami merekomendasikan [misalnya, memesan taksi terlebih dahulu, menggunakan layanan antar-jemput bandara].
          </li>
        </ul>
      </StoryItem>
    </div>
  );
};

export default AccommodationInfo;
