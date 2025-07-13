const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async function(event, context) {
    const { default: fetch } = await import('node-fetch');

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    if (!DISCORD_WEBHOOK_URL) {
        return { statusCode: 500, body: 'Discord Webhook URL not configured.' };
    }

    try {
        const data = JSON.parse(event.body);
        let discordPayload = {};

        // Determine Discord payload based on data type
        switch (data.type) {
            case 'guestbook':
                discordPayload = {
                    embeds: [
                        {
                            title: 'Entri Buku Tamu Baru',
                            color: 0x008080, // Teal color
                            fields: [
                                { name: 'Nama', value: data.name, inline: true },
                                { name: 'Pesan', value: data.message, inline: false },
                            ],
                            timestamp: new Date().toISOString(),
                        },
                    ],
                };
                break;
            case 'rsvp':
                // SIMPLIFIED PAYLOAD FOR DEBUGGING
                discordPayload = {
                    content: `New RSVP: ${data.name} - ${data.attendance} (${data.guests} guests). Food: ${data.foodPreference || 'N/A'}`
                };
                break;
            default:
                // Fallback for unknown types or direct messages
                discordPayload = { content: JSON.stringify(data) };
        }

        // Task 1: Send to Discord
        if (DISCORD_WEBHOOK_URL) {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload),
            });
        }

        // Task 2: If it's a guestbook entry, also send to Google Sheets
        if (data.type === 'guestbook' && GOOGLE_SHEET_ID && GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY) {
            try {
                const serviceAccountAuth = new JWT({
                    email: GOOGLE_CLIENT_EMAIL,
                    key: GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'), // Replace escaped newlines
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });

                const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
                await doc.loadInfo(); // loads document properties and worksheets
                const sheet = doc.sheetsByIndex[0]; // Assumes the first sheet is for the guestbook

                await sheet.addRow({ 
                    Timestamp: new Date().toISOString(), 
                    Name: data.name, 
                    Message: data.message 
                });
            } catch (sheetError) {
                console.error('Error writing to Google Sheet:', sheetError);
            }
        }

        return {
            statusCode: 200,
            body: 'Message processed successfully!',
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: 'Failed to process request.',
        };
    }
};