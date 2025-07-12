exports.handler = async function(event, context) {
    const { default: fetch } = await import('node-fetch'); // Dynamic import for node-fetch

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL environment variable is not set.');
        return { statusCode: 500, body: 'Discord Webhook URL not configured.' };
    }

    try {
        const data = JSON.parse(event.body);

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Discord API error:', response.status, errorText);
            return { statusCode: response.status, body: `Discord API error: ${errorText}` };
        }

        return {
            statusCode: 200,
            body: 'Message sent to Discord successfully!',
        };
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        return {
            statusCode: 500,
            body: 'Failed to send message to Discord.',
        };
    }
};
