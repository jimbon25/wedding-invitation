// netlify/functions/verify-recaptcha.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {

  // Ganti dengan domain undangan Anda
  const allowedOrigin = 'https://wedding-invitation-dn.netlify.app';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Vary': 'Origin'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET_KEY) {
    return { statusCode: 500, headers: corsHeaders, body: 'reCAPTCHA secret key not configured.' };
  }

  let token, name, message, attendance, guests, foodPreference, type;
  try {
    const body = JSON.parse(event.body);
    token = body.token || body.recaptchaToken;
    name = body.name || body.nama || '';
    message = body.message || body.pesan || '';
    attendance = body.attendance || body.kehadiran || '';
    guests = body.guests || body.jumlahTamu || '';
    foodPreference = body.foodPreference || body.preferensiMakanan || '';
    type = body.type || '';
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  try {
    // 1. Verifikasi reCAPTCHA
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    if (!data.success) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, ...data }) };
    }

    // 2. Kirim ke Telegram
    let telegramText = '';
    if (type === 'rsvp') {
      telegramText = `RSVP\nNama: ${name}\nKehadiran: ${attendance}\nJumlah Tamu: ${guests}\nMakanan: ${foodPreference}\nPesan: ${message}`;
    } else if (type === 'guestbook') {
      telegramText = `Guestbook\nNama: ${name}\nPesan: ${message}`;
    } else {
      telegramText = `Nama: ${name}\nPesan: ${message}`;
    }
    let telegramResult = { ok: true };
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText,
        }),
      });
      telegramResult.ok = telegramRes.ok;
    }

    // 3. Kirim ke Discord
    let discordResult = { ok: true };
    if (process.env.DISCORD_WEBHOOK_URL) {
      const discordRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: telegramText,
        }),
      });
      discordResult.ok = discordRes.ok;
    }

    if (!telegramResult.ok || !discordResult.ok) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Failed to send to Telegram or Discord' }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers: corsHeaders, body: 'Failed to verify reCAPTCHA or send message.' };
  }
};
