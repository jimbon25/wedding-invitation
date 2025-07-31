import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import StoryItem from './StoryItem';

const GuestBook: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setNameError('');
    setMessageError('');
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

    if (!message.trim()) {
      setMessageError('Pesan tidak boleh kosong.');
      isValid = false;
    } else if (message.length > 300) {
      setMessageError('Pesan terlalu panjang (maksimal 300 karakter).');
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
          title: 'Entri Buku Tamu Baru',
          color: 0x008080, // Teal color
          fields: [
            { name: 'Nama', value: name, inline: true },
            { name: 'Pesan', value: message, inline: false },
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

      // Kirim ke Telegram (format khusus Guestbook, tidak menunggu hasil)
          const telegramEndpoint = window.location.hostname.includes('vercel.app')
            ? '/api/send-telegram-message'
            : '/.netlify/functions/send-telegram-message';

          fetch(telegramEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'guestbook',
          nama: name,
          pesan: message
        }),
      });

      if (response.ok) {
        setMessage('Terima kasih atas pesan Anda! Pesan Anda telah tercatat.');
        setSubmitStatus('success');
        setName('');
        setMessage('');
        setCaptchaToken(null);
      } else {
        setMessage('Terjadi kesalahan saat mengirim pesan Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengirim pesan Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      console.error('Network or other error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Batasi submit spam: disable tombol submit selama 3 detik setelah submit
  React.useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => setSubmitStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div>
      <StoryItem><h2>Buku Tamu</h2></StoryItem>
      <StoryItem delay="0.2s"><p>Mohon tinggalkan harapan dan pesan Anda untuk Dimas & Niken!</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit} autoComplete="off">
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
              style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
            ></textarea>
            {messageError && <div className="invalid-feedback">{messageError}</div>}
          </div>
          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6LeahZArAAAAAD46TApigkNmPwS7qMCuLt8EAUG9"
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
