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
            Address: Jl. Soekarno - Hatta No.55, Jajar, Kepuhkembeng, Kec. Peterongan, Kabupaten Jombang, Jawa Timur 61481<br />
            Phone: 085607777009<br />
            Website: <span className="link-like"><a href="https://www.tripadvisor.co.id/Hotel_Review-g3561625-d12708910-Reviews-Green_Red_Hotel_Syariah_Jombang-Jombang_East_Java_Java.html" target="_blank" rel="noopener noreferrer">tripadvisor.co.id</a></span><br />
            Notes: Hotel syariah, dekat dengan venue
          </li>
          <li className="mt-3">
            <strong>Hotel B</strong><br />
            Address: Jl. Soekarno - Hatta No.25, Nglungge, Keplaksari, Kec. Peterongan, Kabupaten Jombang, Jawa Timur 61481<br />
            Phone: (0321) 878800<br />
            Website: <span className="link-like"><a href="https://www.traveloka.com/id-id/hotel/indonesia/hotel-yusro-jombang-family-hotel-restaurant--convention-9000000966369" target="_blank" rel="noopener noreferrer">traveloka.com</a></span><br />
            Notes: Family hotel, restoran & convention, harga terjangkau
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
