import React, { useState } from 'react';
import ToastNotification from './ToastNotification';
import ReCAPTCHA from 'react-google-recaptcha';
import StoryItem from './StoryItem';

const GuestBook: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');

  // Confetti/check animation

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
    setMessageError('');
    setCaptchaError('');

    // Blacklist kata kasar/spam/link sederhana
    const blacklist = [
      'anjing', 'babi', 'bangsat', 'kontol', 'memek', 'asu', 'tolol', 'goblok', 'http://', 'https://', 'www.', '.com', '.xyz', '.net', '.org', 'sex', 'porno', 'judi', 'slot', 'casino'
    ];
    if (blacklist.some(word => message.toLowerCase().includes(word))) {
      setMessageError('Pesan mengandung kata yang tidak diperbolehkan.');
      setIsSubmitting(false);
      return;
    }

    let isValid = true;
    // Validasi nama hanya huruf, spasi, titik, koma, dan tanda hubung
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

    if (!message.trim()) {
      setMessageError('Pesan tidak boleh kosong.');
      isValid = false;
    } else if (message.length > 300) {
      setMessageError('Pesan terlalu panjang (maksimal 300 karakter).');
      isValid = false;
    }

    if (!captchaToken) {
      setCaptchaError('Mohon verifikasi captcha.');
      setIsSubmitting(false);
      return;
    }

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    // Payload untuk backend
    const payload = {
      type: 'guestbook',
      name: name.trim(),
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
        setMessage('Terima kasih atas pesan Anda! Pesan Anda telah tercatat.');
        setSubmitStatus('success');
        setShowToast(true);
        setToastMsg('Pesan buku tamu berhasil dikirim!');
        setName('');
        setMessage('');
        setCaptchaToken(null);
      } else if (response.status === 429) {
        setMessage('Terlalu banyak permintaan. Silakan coba lagi beberapa saat lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg('Terlalu banyak permintaan, coba lagi nanti.');
      } else {
        setMessage('Terjadi kesalahan saat mengirim pesan Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg('Gagal mengirim pesan buku tamu.');
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengirim pesan Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      setShowToast(true);
      setToastMsg('Gagal mengirim pesan buku tamu.');
      console.error('Network or other error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Batasi submit spam: disable tombol submit selama 3 detik setelah submit
  React.useEffect(() => {
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
      <StoryItem><h2>Buku Tamu</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Mohon tinggalkan harapan dan pesan Anda untuk Dimas & Niken!</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field untuk anti-bot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} aria-hidden="true" />
          <div className="mb-3">
            <label htmlFor="guestName" className="form-label">Nama Anda:</label>
            <input
              type="text"
              className={`form-control ${nameError ? 'is-invalid' : ''}`}
              id="guestName"
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
            <label htmlFor="guestMessage" className="form-label">Pesan Anda:</label>
            <textarea
              className={`form-control ${messageError ? 'is-invalid' : ''}`}
              id="guestMessage"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              inputMode="text"
              autoComplete="off"
              maxLength={300}
              style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
            ></textarea>
            {messageError && <div className="invalid-feedback">{messageError}</div>}
          </div>
          <div className="mb-3">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeahZArAAAAAD46TApigkNmPwS7qMCuLt8EAUG9"}
              onChange={(token: string | null) => {
                setCaptchaToken(token);
                setCaptchaError('');
              }}
            />
            {captchaError && <div className="text-danger mt-2">{captchaError}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || submitStatus === 'success'} style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
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

export default GuestBook;
