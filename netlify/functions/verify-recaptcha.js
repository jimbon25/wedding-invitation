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
      // Tracking kunjungan
      const guest = name || '-';
      const userAgent = message || '-';
      const timestamp = attendance || new Date().toISOString();
      const sessionId = guests || '-';
      telegramText = [
        '```',
        'Kunjungan Baru:',
        `Guest: ${guest}`,
        `UserAgent: ${userAgent}`,
        `Timestamp: ${timestamp}`,
        `SessionId: ${sessionId}`,
        '```'
      ].join('\n');
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

    // Kirim ke Discord
    if (discordWebhookUrl) {
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
      } else if (type === 'visit') {
        const guest = name || '-';
        const userAgent = message || '-';
        const timestamp = attendance || new Date().toISOString();
        const sessionId = guests || '-';
        embed = {
          title: 'Kunjungan Baru',
          color: 0x00bfff,
          fields: [
            { name: 'Guest', value: guest, inline: true },
            { name: 'UserAgent', value: userAgent, inline: false },
            { name: 'Timestamp', value: timestamp, inline: false },
            { name: 'SessionId', value: sessionId, inline: false },
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
