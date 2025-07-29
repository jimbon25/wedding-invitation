import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import StoryItem from './StoryItem';

const RSVPForm: React.FC = () => {
  const [name, setName] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setNameError('');
    setAttendanceError('');
    setGuestsError('');
    setCaptchaError('');

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

    if (!captchaToken) {
      setCaptchaError('Mohon verifikasi captcha.');
      isValid = false;
    }

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

        // Pilih endpoint reCAPTCHA sesuai environment
        const recaptchaEndpoint = window.location.hostname.includes('vercel.app')
          ? '/api/verify-recaptcha'
          : '/.netlify/functions/verify-recaptcha';

        // Verifikasi captcha ke backend
        const verifyRes = await fetch(recaptchaEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken })
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setCaptchaError('Verifikasi captcha gagal. Silakan coba lagi.');
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

    // Pilih endpoint sesuai environment (Netlify/Vercel)
    const endpoint = window.location.hostname.includes('vercel.app')
      ? '/api/send-discord-message'
      : '/.netlify/functions/send-discord-message';

    try {
      // Kirim ke Discord
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Kirim ke Telegram (format khusus RSVP, tidak menunggu hasil)
          const telegramEndpoint = window.location.hostname.includes('vercel.app')
            ? '/api/send-telegram-message'
            : '/.netlify/functions/send-telegram-message';

          fetch(telegramEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'rsvp',
          nama: name,
          kehadiran: attendance,
          jumlahTamu: guests,
          preferensiMakanan: foodPreference,
          pesan: message
        }),
      });

      if (response.ok) {
        setMessage('Terima kasih atas konfirmasi kehadiran Anda! Tanggapan Anda telah tercatat.');
        setSubmitStatus('success');
        setName('');
        setAttendance('');
        setGuests(0);
        setFoodPreference('');
        setCaptchaToken(null);
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
          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6LeahZArAAAAAD46TApigkNmPwS7qMCuLt8EAUG9"
              onChange={token => {
                setCaptchaToken(token);
                setCaptchaError('');
              }}
            />
            {captchaError && <div className="text-danger mt-2">{captchaError}</div>}
          </div>
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
