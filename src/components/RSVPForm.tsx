import React, { useState } from 'react';
import StoryItem from './StoryItem';

const RSVPForm: React.FC = () => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guests, setGuests] = useState<number>(0);
  const [foodPreference, setFoodPreference] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [guestsError, setGuestsError] = useState('');

  const DISCORD_WEBHOOK_URL = process.env.REACT_APP_RSVP_WEBHOOK_URL; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setNameError('');
    setAttendanceError('');
    setGuestsError('');

    let isValid = true;

    if (!name.trim()) {
      setNameError('Nama tidak boleh kosong.');
      isValid = false;
    }

    if (!attendance) {
      setAttendanceError('Mohon pilih opsi kehadiran.');
      isValid = false;
    }

    if (attendance === 'Yes, I will attend' && (guests <= 0 || isNaN(guests))) {
      setGuestsError('Jumlah tamu harus lebih dari 0.');
      isValid = false;
    }

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    if (!DISCORD_WEBHOOK_URL) {
      setMessage('Mohon konfigurasikan URL Discord Webhook Anda di kode.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      embeds: [
        {
          title: 'Konfirmasi Kehadiran Pernikahan Baru',
          color: 0x00ff00, // Green color
          fields: [
            { name: 'Nama', value: name, inline: true },
            { name: 'Kehadiran', value: attendance, inline: true },
            { name: 'Jumlah Tamu', value: guests.toString(), inline: true },
            { name: 'Preferensi Makanan', value: foodPreference || 'Tidak ditentukan', inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Terima kasih atas konfirmasi kehadiran Anda! Tanggapan Anda telah tercatat.');
        setSubmitStatus('success');
        setName('');
        setAttendance('');
        setGuests(0);
        setFoodPreference('');
      } else {
        setMessage('Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      console.error('Network or other error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <StoryItem><h2>Konfirmasi Kehadiran</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Mohon beritahu kami jika Anda bisa hadir!</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nama Anda:</label>
            <input
              type="text"
              className={`form-control ${nameError ? 'is-invalid' : ''}`}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="attendance" className="form-label">Apakah Anda akan hadir?</label>
            <select
              className={`form-select ${attendanceError ? 'is-invalid' : ''}`}
              id="attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            >
              <option value="">Pilih opsi</option>
              <option value="Yes, I will attend">Ya, saya akan hadir</option>
              <option value="No, I cannot attend">Tidak, saya tidak bisa hadir</option>
            </select>
            {attendanceError && <div className="invalid-feedback">{attendanceError}</div>}
          </div>
          {attendance === 'Yes, I will attend' && (
            <>
              <div className="mb-3">
                <label htmlFor="guests" className="form-label">Jumlah Tamu (termasuk Anda):</label>
                <input
                  type="number"
                  className={`form-control ${guestsError ? 'is-invalid' : ''}`}
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
                  min="0"
                />
                {guestsError && <div className="invalid-feedback">{guestsError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="foodPreference" className="form-label">Preferensi Makanan:</label>
                <select
                  className="form-select"
                  id="foodPreference"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                >
                  <option value="">Pilih opsi</option>
                  <option value="Regular">Reguler</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Bebas Gluten</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      </StoryItem>
      {message && (
        <StoryItem delay="0.6s">
          <div className={`mt-3 alert ${submitStatus === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        </StoryItem>
      )}
    </div>
  );
};

export default RSVPForm;
