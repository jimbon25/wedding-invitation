// Vercel API Route for guest count tracking
import fetch from 'node-fetch';
import UAParser from 'ua-parser-js';

// Rate limit configuration
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 10;
const ipRequestLog = {};

export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigin = 'https://wedding-invitation-dn.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // API Key validation
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.GUEST_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Origin/Referer validation
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '-';
  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  if (referer !== '-' && !referer.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: 'Invalid referer' });
  }

  // Rate limiting logic
  const ip = req.headers['x-forwarded-for'] ? 
    req.headers['x-forwarded-for'].split(',')[0].trim() : 
    'unknown';
  
  const now = Date.now();
  if (!ipRequestLog[ip]) {
    ipRequestLog[ip] = {
      count: 0,
      firstRequest: now
    };
  }

  // Reset if window expired
  if (now - ipRequestLog[ip].firstRequest > RATE_LIMIT_WINDOW) {
    ipRequestLog[ip] = {
      count: 0,
      firstRequest: now
    };
  }

  // Increment and check
  ipRequestLog[ip].count++;
  if (ipRequestLog[ip].count > RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      error: 'Too Many Requests',
      message: 'Terlalu banyak permintaan, coba lagi nanti'
    });
  }

  // Parse user agent
  const uaString = req.headers['user-agent'] || '';
  const ua = new UAParser(uaString);
  const browser = ua.getBrowser();
  const os = ua.getOS();
  const device = ua.getDevice();
  
  const guestData = {
    ip,
    timestamp: new Date().toISOString(),
    userAgent: uaString,
    browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
    os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
    device: device.type || 'desktop',
    referer
  };

  // Check if the user is a search engine bot
  const isBot = /bot|crawl|spider|slurp|baidu|yandex|bing|google|yahoo|duckduckgo/i.test(uaString);
  if (isBot) {
    guestData.isBot = true;
    guestData.botName = uaString.match(/bot|crawl|spider|slurp|baidu|yandex|bing|google|yahoo|duckduckgo/i)[0];
  }

  // Add request method and path
  guestData.method = req.method;
  guestData.path = req.url;

  // Add any query parameters or body data (for POST)
  if (req.method === 'GET') {
    guestData.query = req.query;
  } else if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      // Filter out sensitive data
      const { name, message, attendance } = body;
      guestData.data = { name, attendance };
      if (message) {
        guestData.data.hasMessage = true;
      }
    } catch (e) {
      guestData.bodyError = 'Failed to parse body';
    }
  }

  // Send guest data to a separate Telegram bot
  try {
    // Get Telegram credentials for analytics bot
    const ANALYTICS_BOT_TOKEN = process.env.ANALYTICS_BOT_TOKEN;
    const ANALYTICS_CHAT_ID = process.env.ANALYTICS_CHAT_ID;
    
    if (!ANALYTICS_BOT_TOKEN || !ANALYTICS_CHAT_ID) {
      console.warn('Telegram analytics bot credentials not configured, skipping analytics');
      return res.status(200).json({ success: true, message: 'Visit logged (no notification)' });
    }

    // Format the guest data for Telegram message
    const formattedData = `
📊 *Pengunjung Baru*
🔹 *IP:* \`${guestData.ip}\`
🔹 *Waktu:* \`${guestData.timestamp}\`
🔹 *Browser:* \`${guestData.browser}\`
🔹 *OS:* \`${guestData.os}\`
🔹 *Perangkat:* \`${guestData.device}\`
🔹 *Referrer:* \`${guestData.referer || '-'}\`
${guestData.isBot ? '⚠️ *Bot terdeteksi:* `' + guestData.botName + '`' : ''}
${guestData.path ? '🔹 *Path:* `' + guestData.path + '`' : ''}
${guestData.data?.name ? '🔹 *Nama:* `' + guestData.data.name + '`' : ''}
${guestData.data?.attendance !== undefined ? '🔹 *Kehadiran:* `' + (guestData.data.attendance ? 'Hadir' : 'Tidak Hadir') + '`' : ''}
${guestData.data?.hasMessage ? '🔹 *Pesan:* Ya' : ''}
    `.trim();
    
    // Send to Telegram analytics bot
    const telegramUrl = `https://api.telegram.org/bot${ANALYTICS_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ANALYTICS_CHAT_ID,
        text: formattedData,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Visit logged successfully' 
    });
    
  } catch (error) {
    console.error('Error sending analytics to Telegram:', error);
    
    // Still return success to client even if notification fails
    return res.status(200).json({ 
      success: true, 
      message: 'Visit logged (with notification warning)',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
