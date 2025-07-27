// netlify/functions/verify-recaptcha.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET_KEY) {
    return { statusCode: 500, body: 'reCAPTCHA secret key not configured.' };
  }

  let token;
  try {
    ({ token } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    if (data.success) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ success: false, ...data }) };
    }
  } catch (error) {
    return { statusCode: 500, body: 'Failed to verify reCAPTCHA.' };
  }
};
