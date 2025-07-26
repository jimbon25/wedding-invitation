// netlify/functions/gemini-chat.js
const fetch = require('node-fetch');

const SYSTEM_PROMPT = `
Kamu adalah asisten digital untuk undangan pernikahan Dimas & Niken. 
Jawablah hanya pertanyaan seputar acara, lokasi, waktu, dresscode, RSVP, hadiah, dan informasi yang ada di undangan ini. 
Jika ada pertanyaan di luar topik, tolong arahkan kembali ke informasi undangan.
Tanggal: Sabtu, 25 Juli 2026
Waktu: 10:00 AM - Selesai
Lokasi: Kepuhkembeng, Kec. Peterongan, Kabupaten Jombang, Jawa Timur
`;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return { statusCode: 500, body: 'Gemini API key not configured.' };
  }

  let prompt;
  try {
    ({ prompt } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const fullPrompt = SYSTEM_PROMPT + '\n\nPertanyaan tamu: ' + prompt;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to call Gemini API.' };
  }
};
