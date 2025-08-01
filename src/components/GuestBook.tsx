import React, { useState } from 'react';
import ToastNotification from './ToastNotification';
import ReCAPTCHA from 'react-google-recaptcha';
import StoryItem from './StoryItem';
import { SecurityUtils } from '../utils/security';
import { useLanguage } from '../utils/LanguageContext';

const GuestBook: React.FC = () => {
  const { t, language } = useLanguage();
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

    let isValid = true;

    // Blacklist kata kasar/spam/link sederhana - now using SecurityUtils
    const nameValidation = SecurityUtils.validateName(name);
    const messageValidation = SecurityUtils.validateMessage(message);

    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Nama tidak valid.');
      isValid = false;
    }

    if (!messageValidation.isValid) {
      setMessageError(messageValidation.error || 'Pesan tidak valid.');
      isValid = false;
    }

    // Client-side rate limiting check
    if (!SecurityUtils.checkRateLimit('guestbook_form', 3, 10 * 60 * 1000)) {
      setMessageError('Terlalu banyak percobaan. Silakan coba lagi dalam 10 menit.');
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
        setMessage(language === 'en' ? 
          'Thank you for your message! Your message has been recorded.' : 
          'Terima kasih atas pesan Anda! Pesan Anda telah tercatat.');
        setSubmitStatus('success');
        setShowToast(true);
        setToastMsg(t('guestbook_success'));
        setName('');
        setMessage('');
        setCaptchaToken(null);
      } else if (response.status === 429) {
        setMessage(language === 'en' ? 
          'Too many requests. Please try again later.' : 
          'Terlalu banyak permintaan. Silakan coba lagi beberapa saat lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg(language === 'en' ? 'Too many requests, try again later.' : 'Terlalu banyak permintaan, coba lagi nanti.');
      } else {
        setMessage(language === 'en' ? 
          'An error occurred while sending your message. Please try again.' : 
          'Terjadi kesalahan saat mengirim pesan Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg(t('guestbook_error'));
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage(language === 'en' ? 
        'An error occurred while sending your message. Please check your internet connection.' : 
        'Terjadi kesalahan saat mengirim pesan Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      setShowToast(true);
      setToastMsg(t('guestbook_error'));
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
      <StoryItem><h2>{t('guestbook_title')}</h2></StoryItem>
      <StoryItem delay="0.2s"><p>{t('guestbook_message')}</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field untuk anti-bot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} aria-hidden="true" />
          <div className="mb-3">
            <label htmlFor="guestName" className="form-label">{t('your_name')}:</label>
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
            <label htmlFor="guestMessage" className="form-label">{t('your_message')}:</label>
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
            {isSubmitting ? t('sending') : t('send_message')}
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
