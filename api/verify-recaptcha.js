// Vercel API Route for verifying Google reCAPTCHA (same logic as Netlify function)
const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET_KEY) {
    return res.status(500).json({ error: 'reCAPTCHA secret key not configured.' });
  }

  let token;
  try {
    ({ token } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, ...data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify reCAPTCHA.' });
  }
}
