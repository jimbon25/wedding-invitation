import React from 'react';
import StoryItem from './StoryItem';

const EventDetails: React.FC = () => {
  // Replace with your actual wedding date, time, location, and address
  const weddingDateText = "Sabtu, 25 Juli 2026";
  const weddingTimeText = "10:00 AM - Selesai";
  const venueName = "Kepuhkembeng";
  const venueAddress = "Kepuhkembeng, Kec. Peterongan, Kabupaten Jombang, Jawa Timur";

  // IMPORTANT: Replace this with your Google Maps embed URL
  // Go to Google Maps, search for your venue, click 'Share', then 'Embed a map', and copy the src URL.
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1245.838069249515!2d112.25597325688064!3d-7.543369577526712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1752212567943!5m2!1sid!2sid";

  // Function to format date for ICS
  const formatDateToICS = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const handleDownloadICS = () => {
    // Parse the date and time from the text strings
    // This parsing is simplified and assumes a consistent format.
    // For robust parsing, consider a date library like Moment.js or date-fns.
    const [day, monthName, year] = weddingDateText.split(', ')[1].split(' ');
    const monthMap: { [key: string]: number } = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const month = monthMap[monthName];

    const [time, ampm] = weddingTimeText.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0; // Midnight

    const startDate = new Date(Number(year), month, Number(day), hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours for event duration

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `UID:${new Date().getTime()}@wedding.com`,
      `DTSTAMP:${formatDateToICS(new Date())}`,
      `DTSTART:${formatDateToICS(startDate)}`,
      `DTEND:${formatDateToICS(endDate)}`,
      `SUMMARY:Wedding of Dimas & Niken`,
      `LOCATION:${venueName}, ${venueAddress}`,
      'DESCRIPTION:Join us to celebrate the wedding of Dimas Luis Aditya and Niken Aristania Fitri!',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding_invitation.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <StoryItem><h2>Detail Acara</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Tanggal: <strong>{weddingDateText}</strong></p></StoryItem>
      <StoryItem delay="0.4s"><p>Waktu: <strong>{weddingTimeText}</strong></p></StoryItem>
      <StoryItem delay="0.6s"><p>Lokasi: <strong>{venueName}</strong></p></StoryItem>
      <StoryItem delay="0.8s"><p>{venueAddress}</p></StoryItem>

      <StoryItem delay="1s">
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleDownloadICS}>
            Tambahkan ke Kalender
          </button>
        </div>
      </StoryItem>

      <StoryItem delay="1.2s">
        <div className="mt-4">
          <h3>Lokasi Kami</h3>
          <div className="embed-responsive embed-responsive-16by9" style={{ height: '450px' }}>
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding Venue Location"
            ></iframe>
          </div>
        </div>
        </StoryItem>
      <StoryItem delay="1.4s">
        <p className="mt-2 text-muted">
        </p>
      </StoryItem>
    </div>
  );
};

export default EventDetails;
