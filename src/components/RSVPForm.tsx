import React, { useState, useEffect } from 'react';
import ToastNotification from './ToastNotification';
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
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [guestsError, setGuestsError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    // Honeypot anti-bot
    const form = e.target as HTMLFormElement;
    if (form.website && form.website.value) {
      setSubmitStatus('error');
      setShowToast(true);
      setToastMsg('Permintaan tidak valid.');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    setNameError('');
    setAttendanceError('');
    setGuestsError('');
    setCaptchaError('');

    let isValid = true;

    // Validasi nama hanya huruf, spasi, titik, koma, dan tanda hubung
    // NOTE: Jika target ES5, hapus flag 'u' pada regex berikut agar tidak error.
    const namePattern = /^[a-zA-Z .,'-]+$/;
    if (!name.trim()) {
      setNameError('Nama tidak boleh kosong.');
      isValid = false;
    } else if (!namePattern.test(name.trim())) {
      setNameError('Nama hanya boleh huruf, spasi, titik, koma, dan tanda hubung.');
      isValid = false;
    } else if (name.length > 50) {
      setNameError('Nama terlalu panjang (maksimal 50 karakter).');
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



    const payload = {
      type: 'rsvp',
      name: name.trim(),
      attendance,
      guests,
      foodPreference,
      message: message.trim(),
      token: captchaToken // gunakan field 'token' agar konsisten dengan backend
    };

    // Endpoint Netlify Function
    const endpoint = '/.netlify/functions/verify-recaptcha';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Terima kasih atas konfirmasi kehadiran Anda! Tanggapan Anda telah tercatat.');
        setSubmitStatus('success');
        setShowToast(true);
        setToastMsg('Konfirmasi kehadiran berhasil dikirim!');
        setName('');
        setAttendance('');
        setGuests(0);
        setFoodPreference('');
        setCaptchaToken(null);
      } else if (response.status === 429) {
        setMessage('Terlalu banyak permintaan. Silakan coba lagi beberapa saat lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg('Terlalu banyak permintaan, coba lagi nanti.');
      } else {
        setMessage('Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg('Gagal mengirim konfirmasi kehadiran.');
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      setShowToast(true);
      setToastMsg('Gagal mengirim konfirmasi kehadiran.');
      console.error('Network or other error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Batasi submit spam: disable tombol submit selama 3 detik setelah submit
  useEffect(() => {
    let timer1: NodeJS.Timeout | undefined;
    let timer2: NodeJS.Timeout | undefined;
    if (submitStatus) {
      timer1 = setTimeout(() => setSubmitStatus(null), 3000);
    }
    if (showToast) {
      timer2 = setTimeout(() => setShowToast(false), 3000);
    }
    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [submitStatus, showToast]);

  return (
    <div style={{position:'relative'}}>
      <ToastNotification show={showToast} message={toastMsg} />
      <StoryItem><h2>Konfirmasi Kehadiran</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Mohon beritahu kami jika Anda bisa hadir!</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field untuk anti-bot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} aria-hidden="true" />
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nama Anda:</label>
            <input
              type="text"
              className={`form-control ${nameError ? 'is-invalid' : ''}`}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputMode="text"
              autoComplete="name"
              maxLength={50}
              style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
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
                  inputMode="numeric"
                  autoComplete="off"
                  style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
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
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || submitStatus === 'success'} style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}>
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
