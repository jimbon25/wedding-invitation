const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    if (!GOOGLE_SHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        return { statusCode: 500, body: 'Google Sheets credentials are not configured.' };
    }

    try {
        const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        const entries = rows.map(row => ({
            timestamp: row.Timestamp,
            name: row.Name,
            message: row.Message,
        })).reverse(); // Reverse to show newest messages first

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entries),
        };
    } catch (error) {
        console.error('Error reading from Google Sheet:', error);
        return {
            statusCode: 500,
            body: 'Failed to retrieve guestbook entries.',
        };
    }
};