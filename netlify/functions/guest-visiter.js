// netlify/functions/guest-visiter.js

const fetch = require('node-fetch');
const UAParser = require('ua-parser-js');

// Simple in-memory rate limit store (reset on cold start)
const ipVisitMap = {};
const sessionVisitMap = {};

exports.handler = async function(event, context) {
  const allowedOrigin = 'https://wedding-invitation-dn.netlify.app';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Vary': 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
    // --- Tambahan: Verifikasi reCAPTCHA ---
    const recaptchaToken = data.recaptchaToken;
    if (!recaptchaToken) {
      return { statusCode: 400, headers: corsHeaders, body: 'reCAPTCHA token missing.' };
    }
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    if (!RECAPTCHA_SECRET_KEY) {
      return { statusCode: 500, headers: corsHeaders, body: 'reCAPTCHA secret key not configured.' };
    }
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });
    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success) {
      return { statusCode: 400, headers: corsHeaders, body: 'reCAPTCHA verification failed.' };
    }
    // --- END Tambahan ---
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }


  const guest = data.guest || '-';
  const userAgent = data.userAgent || event.headers['user-agent'] || '-';
  const timestamp = data.timestamp || new Date().toISOString();
  const sessionId = data.sessionId || '-';
  const referrer = event.headers['referer'] || event.headers['referrer'] || '-';


  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '-';
  const now = Date.now();
  const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 menit dalam ms
  // Clean up old entries (optional, for memory safety)
  for (const key in ipVisitMap) {
    if (now - ipVisitMap[key] > RATE_LIMIT_WINDOW) {
      delete ipVisitMap[key];
    }
  }
  for (const key in sessionVisitMap) {
    if (now - sessionVisitMap[key] > RATE_LIMIT_WINDOW) {
      delete sessionVisitMap[key];
    }
  }
  // Rate limit: if IP/sessionId has visited in the last 10 minutes, block
  if ((ipVisitMap[ip] && now - ipVisitMap[ip] < RATE_LIMIT_WINDOW) ||
      (sessionId !== '-' && sessionVisitMap[sessionId] && now - sessionVisitMap[sessionId] < RATE_LIMIT_WINDOW)) {
    return { statusCode: 429, headers: corsHeaders, body: 'Rate limit: Only one visit per 10 minutes per IP/session is allowed.' };
  }
  ipVisitMap[ip] = now;
  if (sessionId !== '-') sessionVisitMap[sessionId] = now;

  // Proteksi spam guest: blacklist
  const guestBlacklist = [
    'bot', 'test', 'admin', 'spammer', 'babi', 'anjing', 'asu', 'kontol', 'memek', 'tolol', 'goblok', 'casino', 'judi', 'sex', 'porno', 'http', 'https', 'www', '.com', '.xyz', '.net', '.org'
  ];
  const guestLower = String(guest).toLowerCase();
  if (guestBlacklist.some(word => guestLower.includes(word))) {
    // Anggap sukses, tapi tidak kirim ke Telegram
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, filtered: true }) };
  }

  // Parse user agent for more detail
  let browser = '-', os = '-', device = '-';
  try {
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();
    browser = uaResult.browser.name ? `${uaResult.browser.name} ${uaResult.browser.version || ''}` : '-';
    os = uaResult.os.name ? `${uaResult.os.name} ${uaResult.os.version || ''}` : '-';
    device = uaResult.device.type ? `${uaResult.device.type} (${uaResult.device.vendor || ''} ${uaResult.device.model || ''})` : 'Desktop';
  } catch (e) {}

  // Format pesan untuk Telegram (tanpa lokasi)
  const text = `Undangan dibuka:\nGuest: ${guest}\nIP: ${ip}\nBrowser: ${browser}\nOS: ${os}\nDevice: ${device}\nUser Agent: ${userAgent}\nWaktu: ${timestamp}\nSession ID: ${sessionId}\nReferrer: ${referrer}`;

  // Kirim ke Telegram
  // Use dedicated bot/channel for visit tracking
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TRACK_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_TRACK_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { statusCode: 500, headers: corsHeaders, body: 'Telegram bot token or chat ID not configured.' };
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text
      })
    });
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers: corsHeaders, body: 'Failed to send message to Telegram.' };
  }
};
