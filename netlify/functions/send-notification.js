// netlify/functions/send-notification.js
// Endpoint untuk RSVP, buku tamu, dan notifikasi

// Menggunakan kode bersama dari functions-shared.js
const sharedFunctions = require('./functions-shared');
exports.handler = sharedFunctions.sharedHandler;
