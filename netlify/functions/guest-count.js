// netlify/functions/guest-count.js
const fetch = require('node-fetch');
const UAParser = require('ua-parser-js');

// Rate limit: max 10 request per IP per 10 menit
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const ipRequestLog = {};

exports.handler = async function(event, context) {
  const allowedOrigin = 'https://wedding-invitation-dn.netlify.app';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Vary': 'Origin'
  };

  // API Key validation (opsional, untuk endpoint lebih privat)
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.GUEST_API_KEY) {
    return { statusCode: 403, headers: corsHeaders, body: 'Forbidden' };
  }

  // Origin/Referer validation
  const origin = event.headers['origin'] || '';
  const referer = event.headers['referer'] || '-';
  if (origin && origin !== allowedOrigin) {
    return { statusCode: 403, headers: corsHeaders, body: 'Invalid origin' };
  }
  if (referer !== '-' && !referer.startsWith(allowedOrigin)) {
    return { statusCode: 403, headers: corsHeaders, body: 'Invalid referer' };
  }

  // Body size limit (2KB)
  if ((event.body || '').length > 2048) {
    return { statusCode: 413, headers: corsHeaders, body: 'Payload too large' };
  }

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, User-Agent, X-Api-Key'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  // User-Agent validation & parsing
  const userAgent = event.headers['user-agent'] || '';
  if (!userAgent || userAgent.length < 10) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid User-Agent' };
  }
  const parser = new UAParser(userAgent);
  const uaResult = parser.getResult();
  const device = uaResult.device.type || 'Desktop';
  const browser = uaResult.browser.name || '-';
  const os = uaResult.os.name || '-';

  // Rate limiting
  const ip = event.headers['x-forwarded-for'] ? event.headers['x-forwarded-for'].split(',')[0].trim() : 'unknown';
  const now = Date.now();
  if (!ipRequestLog[ip]) ipRequestLog[ip] = [];
  ipRequestLog[ip] = ipRequestLog[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (ipRequestLog[ip].length >= RATE_LIMIT_MAX) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Terlalu banyak request dari IP ini.' })
    };
  }
  ipRequestLog[ip].push(now);

  // Parse body
  try {
    const body = JSON.parse(event.body);
    // Honeypot (opsional)
    if (body.website) {
      return { statusCode: 400, headers: corsHeaders, body: 'Bot detected.' };
    }
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  // Ambil parameter ?guest= dari URL jika ada
  let guestParam = '-';
  try {
    const url = new URL(event.headers.referer || '', allowedOrigin);
    guestParam = url.searchParams.get('guest') || '-';
  } catch (e) {
    // ignore
  }



  // Kirim ke Telegram bot (aktif)
  try {
    const BOT_TOKEN = process.env.VISITOR_BOT_TOKEN;
    const CHAT_ID = process.env.VISITOR_CHAT_ID;
    const text = `Visitor\nGuest: ${guestParam}\nIP: ${ip}\nDevice: ${device} (${os})\nBrowser: ${browser}\nUser-Agent: ${userAgent}\nReferer: ${referer}`;
    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      });
    }
  } catch (err) {
    console.error('Failed to send visitor info to Telegram:', err);
  }

  // Response ke client (tidak expose data visitor)
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true })
  };
};
