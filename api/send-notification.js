// Vercel API Route for verifying reCAPTCHA and sending messages to Discord webhook and Telegram bot
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Debug log untuk tracing request
  console.log('=== Incoming Request ===');
  console.log('req.body:', req.body);
  console.log('req.headers:', req.headers);
  
  // Ambil IP address dari header (Vercel: x-forwarded-for)
  const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : 'unknown';
  
  // Set CORS headers
  const allowedOrigins = [
    'https://wedding-invitation-dn.vercel.app',
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000' // for development
  ].filter(Boolean);
  
  const origin = req.headers.origin || req.headers.referer || '';
  const isAllowedOrigin = allowedOrigins.some(allowed => origin.startsWith(allowed));
  
  res.setHeader('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // Simple in-memory rate limiter (per instance, not global)
  const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 menit
  const RATE_LIMIT_MAX = 5; // max 5 request per window
  const ipRequestLog = {};
  
  // Check rate limit
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

  // Parse the request body
  let guestName, guestMessage, attendance, platform, recaptchaToken;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    guestName = body.name?.trim();
    guestMessage = body.message?.trim();
    attendance = body.attendance;
    recaptchaToken = body.token;
    // Platform can be 'discord', 'telegram', or 'all' (default)
    platform = (body.platform || 'all').toLowerCase();
    
    if (!guestName) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Guest name is required' 
      });
    }
    
    if (!recaptchaToken) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'reCAPTCHA token is required' 
      });
    }
  } catch (error) {
    return res.status(400).json({ 
      error: 'Invalid JSON', 
      message: 'Failed to parse request body' 
    });
  }
  
  // Verify reCAPTCHA token
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('RECAPTCHA_SECRET_KEY tidak dikonfigurasi!');
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'reCAPTCHA tidak dikonfigurasi dengan benar'
    });
  }
  
  try {
    // Verify reCAPTCHA token with Google
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });
    
    const recaptchaData = await recaptchaResponse.json();
    
    if (!recaptchaData.success) {
      console.log('Verifikasi reCAPTCHA gagal:', recaptchaData);
      return res.status(400).json({
        error: 'reCAPTCHA Verification Failed',
        message: 'Verifikasi reCAPTCHA gagal',
        errors: recaptchaData['error-codes']
      });
    }
    
    // Jika sampai di sini, berarti reCAPTCHA berhasil diverifikasi
    console.log('reCAPTCHA verification successful');
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Terjadi kesalahan saat memverifikasi reCAPTCHA'
    });
  }

  // Log info about the request source
  console.log(`Request from: ${req.headers['x-forwarded-for'] || 'unknown'}`);
  console.log(`User Agent: ${req.headers['user-agent'] || 'unknown'}`);
  console.log(`Platform requested: ${platform}`);

  // Track results from different platforms
  const results = {
    discord: { sent: false, error: null },
    telegram: { sent: false, error: null }
  };

  // Helper function to escape Discord Markdown
  function escapeDiscordMarkdown(text) {
    if (!text) return '';
    return text.replace(/([_*`~|])/g, '\\$1');
  }

  // Helper function to escape Telegram Markdown
  function escapeTelegramMarkdown(text) {
    if (!text) return '';
    return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
  }

  // Send to Discord webhook if platform is 'discord' or 'all'
  if (platform === 'discord' || platform === 'all') {
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    
    if (DISCORD_WEBHOOK_URL) {
      try {
        const escapedName = escapeDiscordMarkdown(guestName);
        const escapedMessage = escapeDiscordMarkdown(guestMessage);
        const attendanceStatus = attendance ? '✅ Hadir' : '❌ Tidak Hadir';

        // Format message for Discord
        const discordMessage = {
          username: "Wedding RSVP Bot",
          avatar_url: "https://wedding-invitation-dn.vercel.app/favicon.ico",
          embeds: [{
            title: `${attendanceStatus} - ${escapedName}`,
            description: escapedMessage || '(Tidak ada pesan)',
            color: attendance ? 0x57F287 : 0xED4245,
            timestamp: new Date().toISOString(),
            footer: {
              text: "Wedding Invitation RSVP"
            }
          }]
        };

        // Send message to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordMessage)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Discord API error: ${response.status} ${errorText}`);
        }

        // Log the successful submission
        console.log(`RSVP submitted to Discord: ${guestName} (${attendance ? 'Attending' : 'Not attending'})`);
        results.discord.sent = true;
      } catch (error) {
        console.error('Error sending to Discord:', error);
        results.discord.error = error.message;
      }
    } else {
      console.warn('Discord webhook URL not configured');
      results.discord.error = 'Discord webhook URL not configured';
    }
  }

  // Send to Telegram bot if platform is 'telegram' or 'all'
  if (platform === 'telegram' || platform === 'all') {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const escapedName = escapeTelegramMarkdown(guestName);
        const escapedMessage = escapeTelegramMarkdown(guestMessage || '(Tidak ada pesan)');
        const attendanceSymbol = attendance ? '✅' : '❌';
        const attendanceStatus = attendance ? 'Hadir' : 'Tidak Hadir';

        // Format message for Telegram using MarkdownV2 format
        const telegramMessage = `
*RSVP Baru* ${attendanceSymbol}
*Nama:* ${escapedName}
*Kehadiran:* ${escapeTelegramMarkdown(attendanceStatus)}
*Pesan:* ${escapedMessage}
*Waktu:* ${escapeTelegramMarkdown(new Date().toLocaleString('id-ID'))}
        `.trim();

        // Send message to Telegram bot
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'MarkdownV2'
          })
        });

        const data = await response.json();
        
        if (!data.ok) {
          throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
        }

        // Log the successful submission
        console.log(`RSVP submitted to Telegram: ${guestName} (${attendance ? 'Attending' : 'Not attending'})`);
        results.telegram.sent = true;
      } catch (error) {
        console.error('Error sending to Telegram:', error);
        results.telegram.error = error.message;
      }
    } else {
      console.warn('Telegram credentials not configured properly');
      results.telegram.error = 'Telegram credentials not configured properly';
    }
  }

  // Check overall result and respond accordingly
  const successCount = Object.values(results).filter(r => r.sent).length;
  const platforms = Object.keys(results).filter(k => results[k].sent);
  
  // If at least one platform succeeded, consider it a success
  if (successCount > 0) {
    return res.status(200).json({
      success: true,
      message: `RSVP submitted successfully to ${platforms.join(' and ')}`,
      details: results
    });
  } else {
    // If all platforms failed or none were selected
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to send message to any platform',
      details: results
    });
  }
}
