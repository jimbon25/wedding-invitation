// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // max 5 requests
const WINDOW_MS = 60 * 1000; // per 1 minute
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

    const { default: fetch } = await import('node-fetch'); // Dynamic import for node-fetch

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL environment variable is not set.');
        return { statusCode: 500, body: 'Discord Webhook URL not configured.' };
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

    try {
        const data = JSON.parse(event.body);
        // --- Tambahan: Verifikasi reCAPTCHA ---
        const recaptchaToken = data.recaptchaToken;
        if (!recaptchaToken) {
            return { statusCode: 400, body: 'reCAPTCHA token missing.' };
        }
        const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
        if (!RECAPTCHA_SECRET_KEY) {
            return { statusCode: 500, body: 'reCAPTCHA secret key not configured.' };
        }
        const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        });
        const recaptchaData = await recaptchaRes.json();
        if (!recaptchaData.success) {
            return { statusCode: 400, body: 'reCAPTCHA verification failed.' };
        }
        // --- END Tambahan ---
        // Validasi & sanitasi data
        if (data.name && !isValidName(data.name)) {
            return { statusCode: 400, body: 'Invalid name' };
        }
        if (data.message && typeof data.message === 'string' && data.message.length > 300) {
            return { statusCode: 400, body: 'Message too long' };
        }
        // Escape input
        if (data.name) data.name = sanitizeInput(data.name, 50);
        if (data.message) data.message = sanitizeInput(data.message, 300);
        // Escape all string fields in data (optional, for extra safety)
        Object.keys(data).forEach(k => {
            if (typeof data[k] === 'string') data[k] = sanitizeInput(data[k], 300);
        });

        // Format payload sesuai Discord Webhook (harus ada 'content')
        let discordPayload = {};
        if (data.type === 'guestbook') {
            discordPayload = {
                embeds: [
                  {
                    title: 'Buku Tamu Baru',
                    color: 3447003,
                    fields: [
                      { name: 'Nama', value: data.name || '-', inline: true },
                      { name: 'Pesan', value: data.message || '-', inline: false }
                    ],
                    timestamp: new Date().toISOString()
                  }
                ]
            };
        } else if (data.type === 'rsvp') {
            // RSVP: gunakan embed Discord agar lebih rapi
            discordPayload = {
                embeds: [
                  {
                    title: 'Konfirmasi Kehadiran Pernikahan Baru',
                    color: 65280,
                    fields: [
                      { name: 'Nama', value: data.name || '-', inline: true },
                      { name: 'Kehadiran', value: data.attendance || '-', inline: true },
                      { name: 'Jumlah Tamu', value: (data.guests !== undefined ? String(data.guests) : '-'), inline: true },
                      { name: 'Preferensi Makanan', value: data.foodPreference || 'Tidak ditentukan', inline: true },
                      { name: 'Pesan', value: data.message || '-', inline: false }
                    ],
                    timestamp: new Date().toISOString()
                  }
                ]
            };
        } else {
            // fallback: kirim semua data sebagai JSON string
            discordPayload = {
                content: JSON.stringify(data)
            };
        }

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Discord API error:', response.status, errorText);
            return { statusCode: response.status, body: `Discord API error: ${errorText}` };
        }

        return {
            statusCode: 200,
            body: 'Message sent to Discord successfully!',
        };
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        return {
            statusCode: 500,
            body: 'Failed to send message to Discord.',
        };
    }
};
