// netlify/functions/send-telegram-message.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { statusCode: 500, body: 'Telegram bot token or chat ID not configured.' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // Format pesan, sesuaikan dengan kebutuhan RSVP/Guestbook
  const { nama, kehadiran, jumlahTamu, pesan } = body;
  const text = `RSVP Baru:\nNama: ${nama || '-'}\nKehadiran: ${kehadiran || '-'}\nJumlah Tamu: ${jumlahTamu || '-'}\nPesan: ${pesan || '-'}`;

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
