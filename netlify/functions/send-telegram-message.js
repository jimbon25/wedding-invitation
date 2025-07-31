// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // max 5 requests
const WINDOW_MS = 60 * 1000; // per 1 minute
// netlify/functions/send-telegram-message.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS strict
  const ALLOWED_ORIGINS = [
    'https://wedding-invitation-dn.netlify.app',
    'http://localhost:3000' // opsional untuk dev
  ];
  const origin = event.headers.origin || '';
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return {
      statusCode: 403,
      headers: { 'Access-Control-Allow-Origin': origin },
      body: 'Forbidden: CORS'
    };
  }
  // Helper: escape HTML
  function sanitizeInput(str, maxLen = 300) {
    if (typeof str !== 'string') return '';
    let s = str.slice(0, maxLen);
    s = s.replace(/[<>&'"`]/g, c => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;', '`': '&#96;'
    }[c]));
    return s;
  }
  function isValidName(name) {
    return typeof name === 'string' && name.length <= 50 && /^[a-zA-Z .,'-]+$/.test(name);
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { statusCode: 500, body: 'Telegram bot token or chat ID not configured.' };
  }


  // Rate limit logic
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || event.headers['x-real-ip'] || 'unknown';
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { count: 1, start: now };
    rateLimitMap.set(ip, entry);
  } else {
    if (now - entry.start < WINDOW_MS) {
      if (entry.count >= RATE_LIMIT) {
        return { statusCode: 429, body: 'Too many requests. Please try again later.' };
      }
      entry.count++;
    } else {
      // Reset window
      entry.count = 1;
      entry.start = now;
    }
    rateLimitMap.set(ip, entry);
  }

  let body;
  try {
    body = JSON.parse(event.body);
    // Validasi & sanitasi data
    if (body.nama && !isValidName(body.nama)) {
      return { statusCode: 400, body: 'Invalid name' };
    }
    if (body.pesan && typeof body.pesan === 'string' && body.pesan.length > 300) {
      return { statusCode: 400, body: 'Message too long' };
    }
    // Escape input
    if (body.nama) body.nama = sanitizeInput(body.nama, 50);
    if (body.pesan) body.pesan = sanitizeInput(body.pesan, 300);
    // Escape all string fields in body (optional, for extra safety)
    Object.keys(body).forEach(k => {
      if (typeof body[k] === 'string') body[k] = sanitizeInput(body[k], 300);
    });
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // Format pesan sesuai tipe
  let text = '';
  if (body.type === 'rsvp') {
    const { nama, kehadiran, jumlahTamu, preferensiMakanan, pesan } = body;
    text = `RSVP Baru:\nNama: ${nama || '-'}\nKehadiran: ${kehadiran || '-'}\nJumlah Tamu: ${jumlahTamu || '-'}\nPreferensi Makanan: ${preferensiMakanan || '-'}\nPesan: ${pesan || '-'}`;
  } else if (body.type === 'guestbook') {
    // Support field name/message dari frontend, fallback ke nama/pesan
    const nama = body.nama || body.name || '-';
    const pesan = body.pesan || body.message || '-';
    text = `Buku Tamu Baru:\nNama: ${nama}\nPesan: ${pesan}`;
  } else {
    text = 'Pesan tidak diketahui sumbernya.';
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text
      })
    });
    const data = await response.json();
    if (!data.ok) {
      return { statusCode: 500, body: JSON.stringify(data) };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to send message to Telegram.' };
  }
};
