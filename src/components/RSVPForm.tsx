import React, { useState, useEffect } from 'react';
import ToastNotification from './ToastNotification';
import ReCAPTCHA from 'react-google-recaptcha';
import StoryItem from './StoryItem';
import { SecurityUtils } from '../utils/security';
import { useLanguage } from '../utils/LanguageContext';

const RSVPForm: React.FC = () => {
  const { t, language } = useLanguage();
  
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

    // Enhanced validation using SecurityUtils
    const nameValidation = SecurityUtils.validateName(name);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Nama tidak valid.');
      isValid = false;
    }

    // Client-side rate limiting check
    if (!SecurityUtils.checkRateLimit('rsvp_form', 3, 10 * 60 * 1000)) {
      setNameError('Terlalu banyak percobaan. Silakan coba lagi dalam 10 menit.');
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
        setMessage(language === 'en' ? 
          'Thank you for your attendance confirmation! Your response has been recorded.' : 
          'Terima kasih atas konfirmasi kehadiran Anda! Tanggapan Anda telah tercatat.');
        setSubmitStatus('success');
        setShowToast(true);
        setToastMsg(t('rsvp_success'));
        setName('');
        setAttendance('');
        setGuests(0);
        setFoodPreference('');
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
          'An error occurred while sending your attendance confirmation. Please try again.' : 
          'Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon coba lagi.');
        setSubmitStatus('error');
        setShowToast(true);
        setToastMsg(t('rsvp_error'));
        console.error('Discord Webhook Error:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage(language === 'en' ? 
        'An error occurred while sending your attendance confirmation. Please check your internet connection.' : 
        'Terjadi kesalahan saat mengirim konfirmasi kehadiran Anda. Mohon periksa koneksi internet Anda.');
      setSubmitStatus('error');
      setShowToast(true);
      setToastMsg(t('rsvp_error'));
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
      <StoryItem><h2>{t('rsvp_title')}</h2></StoryItem>
      <StoryItem delay="0.2s"><p>{t('rsvp_message')}</p></StoryItem>
      <StoryItem delay="0.4s">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Honeypot field untuk anti-bot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} aria-hidden="true" />
          <div className="mb-3">
            <label htmlFor="name" className="form-label">{t('your_name')}:</label>
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
            <label htmlFor="attendance" className="form-label">{t('will_you_attend')}?</label>
            <select
              className={`form-select ${attendanceError ? 'is-invalid' : ''}`}
              id="attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            >
              <option value="">{t('select_option')}</option>
              <option value="Yes, I will attend">{t('yes_attend')}</option>
              <option value="No, I cannot attend">{t('no_attend')}</option>
            </select>
            {attendanceError && <div className="invalid-feedback">{attendanceError}</div>}
          </div>
          {attendance === 'Yes, I will attend' && (
            <>
              <div className="mb-3">
                <label htmlFor="guests" className="form-label">{t('guest_count')}:</label>
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
                <label htmlFor="foodPreference" className="form-label">{t('food_preference')}:</label>
                <select
                  className="form-select"
                  id="foodPreference"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                >
                  <option value="">{t('select_option')}</option>
                  <option value="Regular">{t('regular')}</option>
                  <option value="Vegetarian">{t('vegetarian')}</option>
                  <option value="Gluten-Free">{t('gluten_free')}</option>
                </select>
              </div>
            </>
          )}
          <div className="mb-3">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeahZArAAAAAD46TApigkNmPwS7qMCuLt8EAUG9"}
              onChange={token => {
                setCaptchaToken(token);
                setCaptchaError('');
              }}
            />
            {captchaError && <div className="text-danger mt-2">{captchaError}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || submitStatus === 'success'} style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}>
            {isSubmitting ? t('sending') : t('send_confirmation')}
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
