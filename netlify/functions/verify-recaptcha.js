// netlify/functions/verify-recaptcha.js
const fetch = require('node-fetch');


// Simple in-memory rate limiter (per instance, not global)
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 menit
const RATE_LIMIT_MAX = 5; // max 5 request per window
const ipRequestLog = {};

// Escape karakter khusus Markdown Telegram/Discord agar tidak menyebabkan format error
function escapeMarkdown(text) {
  if (!text) return '';
  // Escape karakter untuk Telegram Markdown (mode Markdown, bukan HTML)
  // Karakter: _ * [ ] ( ) ~ ` > # + - = | { } . !
  return text.replace(/([_*\]()~`>#+\-=|{}.!])/g, '$1')
    .replace(/([[\]])/g, '$1'); // [ dan ] tidak perlu di-escape di dalam karakter class
}

exports.handler = async function(event, context) {
  // Debug log untuk tracing request
  console.log('=== Incoming Request ===');
  console.log('event.body:', event.body);
  console.log('event.headers:', event.headers);
  
  // Ambil IP address dari header (Netlify: x-forwarded-for) - pindahkan ke atas
  const ip = event.headers['x-forwarded-for'] ? event.headers['x-forwarded-for'].split(',')[0].trim() : 'unknown';
  
  // Ganti dengan domain undangan Anda
  const allowedOrigins = [
    'https://wedding-invitation-dn.netlify.app',
    process.env.REACT_APP_SITE_URL,
    'http://localhost:3000' // untuk development
  ].filter(Boolean);
  
  const origin = event.headers.origin || event.headers.referer || '';
  const isAllowedOrigin = allowedOrigins.some(allowed => origin.startsWith(allowed));
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  // Debug/log event.body untuk tracing error Invalid JSON
  if (!event.body || typeof event.body !== 'string' || event.body.trim() === '') {
    console.error('Request body kosong atau bukan string:', event.body);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Request body kosong atau tidak valid.' })
    };
  }

  let token, name, message, attendance, guests, foodPreference, type;
  try {
    const body = JSON.parse(event.body);
    token = body.token || body.recaptchaToken;
    name = escapeMarkdown(String(body.name || body.nama || ''));
    message = escapeMarkdown(String(body.message || body.pesan || ''));
    attendance = escapeMarkdown(String(body.attendance || body.kehadiran || ''));
    guests = escapeMarkdown(String(body.guests || body.jumlahTamu || ''));
    foodPreference = escapeMarkdown(String(body.foodPreference || body.preferensiMakanan || ''));
    type = body.type || '';

    // Validasi panjang nama dan pesan (backend, anti-bypass)
    if (name.length > 50) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Nama terlalu panjang (maksimal 50 karakter).' }) };
    }
    if (message.length > 300) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Pesan terlalu panjang (maksimal 300 karakter).' }) };
    }

    // Enhanced content validation
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)/gi,
      /(\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g
    ];

    const combinedText = `${name} ${message}`.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(combinedText)) {
        console.warn(`Suspicious content detected from IP ${ip}:`, combinedText.substring(0, 100));
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Konten tidak valid terdeteksi.' }) };
      }
    }
  } catch (e) {
    console.error('JSON.parse error:', e);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Invalid JSON', detail: String(e) })
    };
  }
  // Rate limiting sudah menggunakan ip dari atas
  const now = Date.now();
  if (!ipRequestLog[ip]) {
    ipRequestLog[ip] = [];
  }
  // Hapus request yang sudah lewat window
  ipRequestLog[ip] = ipRequestLog[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (ipRequestLog[ip].length >= RATE_LIMIT_MAX) {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((RATE_LIMIT_WINDOW - (now - ipRequestLog[ip][0])) / 1000)),
        'Access-Control-Allow-Origin': 'https://wedding-invitation-dn.netlify.app',
        'Vary': 'Origin'
      },
      body: JSON.stringify({ success: false, error: 'Terlalu banyak permintaan dari IP ini. Coba lagi nanti.' })
    };
  }
  ipRequestLog[ip].push(now);

  // ...moved to top...

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET_KEY) {
    return { statusCode: 500, headers: corsHeaders, body: 'reCAPTCHA secret key not configured.' };
  }


  // ...existing code...

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

    // 2. Format pesan Telegram (triple backtick)
    let telegramText = '';
    if (type === 'rsvp') {
      telegramText = [
        '```',
        'RSVP Baru:',
        `Nama: ${name || '-'}`,
        `Kehadiran: ${attendance || '-'}`,
        `Jumlah Tamu: ${guests || '-'}`,
        `Preferensi Makanan: ${foodPreference || '-'}`,
        `Pesan: ${message || '-'}`,
        '```'
      ].join('\n');
    } else if (type === 'guestbook') {
      telegramText = [
        '```',
        'Buku Tamu Baru:',
        `Nama: ${name || '-'}`,
        `Pesan: ${message || '-'}`,
        '```'
      ].join('\n');
    } else if (type === 'visit') {
      // Tidak melakukan tracking kunjungan
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, info: 'Visit tracking disabled.' }) };
    } else {
      telegramText = [
        '```',
        `Nama: ${name || '-'}`,
        `Pesan: ${message || '-'}`,
        '```'
      ].join('\n');
    }
    let telegramResult = { ok: true };
    let discordResult = { ok: true };
    // Pilih bot/channel sesuai type
    let telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    let telegramChatId = process.env.TELEGRAM_CHAT_ID;
    let discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (type === 'visit') {
      telegramBotToken = process.env.VISIT_TELEGRAM_BOT_TOKEN || telegramBotToken;
      telegramChatId = process.env.VISIT_TELEGRAM_CHAT_ID || telegramChatId;
      discordWebhookUrl = process.env.VISIT_DISCORD_WEBHOOK_URL || discordWebhookUrl;
    }

    // Kirim ke Telegram
    if (telegramBotToken && telegramChatId) {
      const telegramRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramText,
          parse_mode: 'Markdown'
        }),
      });
      telegramResult.ok = telegramRes.ok;
    }

    // Kirim ke Discord kecuali type 'visit'
    if (discordWebhookUrl && type !== 'visit') {
      let embed = {};
      if (type === 'rsvp') {
        embed = {
          title: 'RSVP Baru',
          color: 0x00bfff,
          fields: [
            { name: 'Nama', value: name || '-', inline: true },
            { name: 'Kehadiran', value: attendance || '-', inline: true },
            { name: 'Jumlah Tamu', value: guests ? String(guests) : '-', inline: true },
            { name: 'Preferensi Makanan', value: foodPreference || '-', inline: true },
            { name: 'Pesan', value: message || '-', inline: false },
          ],
          timestamp: new Date().toISOString(),
        };
      } else if (type === 'guestbook') {
        embed = {
          title: 'Buku Tamu Baru',
          color: 0x00bfff,
          fields: [
            { name: 'Nama', value: name || '-', inline: true },
            { name: 'Pesan', value: message || '-', inline: false },
          ],
          timestamp: new Date().toISOString(),
        };
      } else {
        embed = {
          title: 'Pesan Baru',
          color: 0x00bfff,
          fields: [
            { name: 'Nama', value: name || '-', inline: true },
            { name: 'Pesan', value: message || '-', inline: false },
          ],
          timestamp: new Date().toISOString(),
        };
      }
      const discordRes = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [embed],
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
