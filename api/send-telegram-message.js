// Vercel API Route for sending Telegram messages (same logic as Netlify function)
const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: 'Telegram bot token or chat ID not configured.' });
  }

  let body;
  try {
    body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Format pesan sesuai tipe
  let text = '';
  if (body.type === 'rsvp') {
    const { nama, kehadiran, jumlahTamu, preferensiMakanan, pesan } = body;
    text = `RSVP Baru:\nNama: ${nama || '-'}\nKehadiran: ${kehadiran || '-'}\nJumlah Tamu: ${jumlahTamu || '-'}\nPreferensi Makanan: ${preferensiMakanan || '-'}\nPesan: ${pesan || '-'}`;
  } else if (body.type === 'guestbook') {
    const { nama, pesan } = body;
    text = `Guestbook Baru:\nNama: ${nama || '-'}\nPesan: ${pesan || '-'}`;
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
      return res.status(500).json(data);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message to Telegram.' });
  }
}
