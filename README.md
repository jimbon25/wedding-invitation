# Wedding Invitation

<p align="left">
  <a href="https://app.netlify.com/projects/wedding-invitation-dn/deploys">
    <img src="https://api.netlify.com/api/v1/badges/7ed1979a-a91d-47b6-b442-0debc1cbb755/deploy-status" alt="Netlify Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" />
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node.js-16%20%7C%2018%20%7C%2020-brightgreen" alt="Node.js Version" />
  </a>
  <a href="https://github.com/jimbon25/wedding-invitation/commits/main">
    <img src="https://img.shields.io/github/last-commit/jimbon25/wedding-invitation?logo=github" alt="Last Commit" />
  </a>
</p>

This digital wedding invitation app is built with React, TypeScript, providing a seamless, interactive, and responsive experience for all guests. It features personalized invitations, RSVP and guest book forms protected by Google reCAPTCHA, and all submissions are securely sent to Discord via serverless functions, as well as to Telegram via bot integration. The app supports both Netlify and Vercel deployments, with all serverless endpoints (Discord, Telegram, reCAPTCHA) auto-selected based on the environment.

<p align="center">
<img src="public/images/screenshoot/ss.jpg" width="500" alt="Screenshot 1"/>
</p>

## Table of Contents

- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Notification Systems](#notification-systems)
    - [Discord Webhook](#discord-webhook)
    - [Telegram Bot](#telegram-bot)
    - [Using Both Systems](#using-both-systems)
    - [Switching Between Systems](#switching-between-systems)
  - [Google reCAPTCHA](#google-recaptcha)
  - [Gemini AI Chat](#gemini-ai-chat)
- [Deployment](#deployment)
  - [Netlify Deployment](#netlify-deployment)
  - [Vercel Deployment](#vercel-deployment)
  - [Multi-platform Support](#multi-platform-support)
  - [Platform-Specific Configuration](#platform-specific-configuration)
- [Security Measures](#security-measures)
  - [Input Validation & Sanitization](#input-validation--sanitization)
  - [Rate Limiting](#rate-limiting)
  - [CAPTCHA Protection](#captcha-protection)
  - [CORS & Origin Validation](#cors--origin-validation)
  - [Anti-Bot Protection](#anti-bot-protection)
  - [Security Best Practices](#security-best-practices)
  - [Content Security Policy](#content-security-policy)
  - [Data Sanitization](#data-sanitization)
  - [Security Headers](#security-headers)
  - [Security Configuration](#security-configuration)
  - [Monitoring & Alerts](#monitoring--alerts)
  - [Security Maintenance](#security-maintenance)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Node.js Version](#nodejs-version)
- [Maintenance](#maintenance)
- [Contact](#contact)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Main Features

- **Cover Screen**: Personalized opening screen with guest name from URL.
- **Countdown**: Countdown timer to the wedding day.
- **Our Story**: The couple's journey and love story.
- **Event Details**: Information about time, location, and agenda.
- **Gallery**: Prewedding and special moment photos.
- **RSVP Confirmation**: Form for guests to confirm attendance. Protected by Google reCAPTCHA.
- **Guest Book**: Guests can leave messages and wishes. Protected by Google reCAPTCHA.
- **Gift Info & Registry**: Bank account, e-wallet, and gift registry information.
- **Accommodation & Transportation**: Hotel and transport recommendations for out-of-town guests.
- **Modern UI & Animation**: Uses AOS, Bootstrap, and custom CSS.
- **Gemini AI Chat**: Floating Gemini AI Chat for instant Q&A about the event.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Bootstrap 5](https://getbootstrap.com/)
- **Styling**: CSS, [Bootstrap Icons](https://icons.getbootstrap.com/), [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **Interactivity**: [Slick Carousel](https://kenwheeler.github.io/slick/), Custom Animations
- **Backend**: Serverless Functions ([Netlify](https://www.netlify.com/products/functions/)/[Vercel](https://vercel.com/docs/functions))
- **Security**: [Google reCAPTCHA](https://developers.google.com/recaptcha), Input Validation, Rate Limiting
- **Notifications**: [Discord Webhooks](https://discord.com/developers/docs/resources/webhook), [Telegram Bot API](https://core.telegram.org/bots/api)
- **AI**: [Google Gemini API](https://ai.google.dev/gemini-api) for AI chat assistant

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jimbon25/wedding-invitation.git
   cd wedding-invitation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your values (see Configuration section)

4. Start development server:
   ```bash
   npm start
   ```

5. Access the site at [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables

Set these environment variables on your hosting platform:

| Variable Name | Netlify | Vercel | Description |
|---------------|---------|--------|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ | ✅ | Your Discord channel webhook URL |
| `RECAPTCHA_SECRET_KEY` | ✅ | ✅ | reCAPTCHA v2 secret key (server side) |
| `TELEGRAM_BOT_TOKEN` | ✅ | ✅ | Your Telegram bot token |
| `TELEGRAM_CHAT_ID` | ✅ | ✅ | Chat ID to send notifications |
| `GEMINI_API_KEY` | ✅ | ✅ | Google Gemini API key |
| `GUEST_API_KEY` | ✅ | ✅ | Custom API key for guest tracking |
| `ANALYTICS_BOT_TOKEN` | ✅ | ✅ | Token for analytics Telegram bot |
| `ANALYTICS_CHAT_ID` | ✅ | ✅ | Chat ID for analytics data |
| `REACT_APP_RECAPTCHA_SITE_KEY` | ✅ | ❌ | Public reCAPTCHA key (Netlify) |
| `REACT_APP_GUEST_API_KEY` | ✅ | ❌ | Public guest API key (Netlify) |
| `REACT_APP_SITE_URL` | ✅ | ❌ | Site URL for Netlify |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ❌ | ✅ | Public reCAPTCHA key (Vercel) |
| `NEXT_PUBLIC_GUEST_API_KEY` | ❌ | ✅ | Public guest API key (Vercel) |
| `NEXT_PUBLIC_SITE_URL` | ❌ | ✅ | Site URL for Vercel |

### Notification Systems

You can use Discord webhook, Telegram bot, or both for receiving notifications from RSVP and guest book submissions.

#### Discord Webhook

To use only Discord webhook for notifications:

1. Create a webhook in your Discord server:
   - Go to Server Settings > Integrations > Webhooks
   - Click "New Webhook", name it, and select a channel
   - Copy the Webhook URL

2. Add the webhook URL as environment variable:
   ```
   DISCORD_WEBHOOK_URL=your_webhook_url
   ```

3. To disable Telegram, simply don't set the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` variables.

**Implementation Example (Discord Only):**

```javascript
// In your serverless function (e.g., api/send-notification.js or netlify/functions/send-notification.js)
exports.handler = async function(event, context) {
  try {
    // Parse the incoming data
    const data = JSON.parse(event.body);
    
    // Validate the data here...
    
    // Send to Discord webhook
    const discordResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: 'New RSVP Submission',
          fields: [
            { name: 'Name', value: data.name, inline: true },
            { name: 'Attendance', value: data.attendance ? 'Yes' : 'No', inline: true },
            { name: 'Number of Guests', value: data.guests, inline: true },
            { name: 'Message', value: data.message || 'No message provided' }
          ],
          color: 3447003,
          timestamp: new Date()
        }]
      })
    });
    
    if (!discordResponse.ok) {
      throw new Error('Failed to send to Discord webhook');
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send notification' })
    };
  }
};
```

#### Telegram Bot

To use only Telegram bot for notifications:

1. Create a Telegram bot:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command and follow the steps
   - Copy the bot token provided

2. Get your chat ID:
   - Add [@userinfobot](https://t.me/userinfobot) to your group
   - The bot will show you the chat ID

3. Add the Telegram variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

4. To disable Discord, simply don't set the `DISCORD_WEBHOOK_URL` variable.

**Implementation Example (Telegram Only):**

```javascript
// In your serverless function (e.g., api/send-notification.js or netlify/functions/send-notification.js)
exports.handler = async function(event, context) {
  try {
    // Parse the incoming data
    const data = JSON.parse(event.body);
    
    // Validate the data here...
    
    // Format message for Telegram
    const message = `
*New RSVP Submission*
*Name:* ${data.name}
*Attendance:* ${data.attendance ? 'Yes' : 'No'}
*Number of Guests:* ${data.guests}
*Message:* ${data.message || 'No message provided'}
`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    if (!telegramResponse.ok) {
      throw new Error('Failed to send to Telegram');
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send notification' })
    };
  }
};
```

#### Using Both Systems

To receive notifications on both Discord and Telegram:

1. Configure both webhook URL and Telegram tokens as described above.
2. Set all related environment variables.
3. The system will automatically send notifications to both platforms.

**Implementation Example (Both Systems):**

```javascript
// In your serverless function (e.g., api/send-notification.js or netlify/functions/send-notification.js)
exports.handler = async function(event, context) {
  try {
    // Parse the incoming data
    const data = JSON.parse(event.body);
    
    // Validate the data here...
    
    const notifications = [];
    
    // Send to Discord if webhook URL is set
    if (process.env.DISCORD_WEBHOOK_URL) {
      const discordPromise = fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: 'New RSVP Submission',
            fields: [
              { name: 'Name', value: data.name, inline: true },
              { name: 'Attendance', value: data.attendance ? 'Yes' : 'No', inline: true },
              { name: 'Number of Guests', value: data.guests, inline: true },
              { name: 'Message', value: data.message || 'No message provided' }
            ],
            color: 3447003,
            timestamp: new Date()
          }]
        })
      });
      notifications.push(discordPromise);
    }
    
    // Send to Telegram if bot token and chat ID are set
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `
*New RSVP Submission*
*Name:* ${data.name}
*Attendance:* ${data.attendance ? 'Yes' : 'No'}
*Number of Guests:* ${data.guests}
*Message:* ${data.message || 'No message provided'}
`;

      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const telegramPromise = fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      notifications.push(telegramPromise);
    }
    
    // Wait for all notifications to complete
    await Promise.all(notifications);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notifications sent successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send notifications' })
    };
  }
};
```

#### Switching Between Systems

To switch from Discord to Telegram:

1. Add the Telegram environment variables as described above
2. Remove or comment out the Discord webhook URL
3. Redeploy your application

To switch from Telegram to Discord:

1. Add the Discord webhook URL as described above
2. Remove or comment out the Telegram variables
3. Redeploy your application

### Google reCAPTCHA

1. Register for reCAPTCHA v2:
   - Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
   - Choose reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - Add your domain(s)
   - Complete the registration

2. Set environment variables:
   - Server side: `RECAPTCHA_SECRET_KEY=your_secret_key`
   - Client side (Netlify): `REACT_APP_RECAPTCHA_SITE_KEY=your_site_key`
   - Client side (Vercel): `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key`

3. For more information, see the [reCAPTCHA documentation](https://developers.google.com/recaptcha/docs/display)

### Gemini AI Chat

1. Get a Gemini API key:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an API key

2. Set the environment variable:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. The AI chat is pre-configured to answer questions about your wedding invitation and will be available through a floating chat button.

For more information on configuring and using the Gemini API, see:
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini API Quickstart Guide](https://ai.google.dev/gemini-api/docs/get-started)

## Deployment

The application supports deployment on both Netlify and Vercel platforms and automatically adapts to the hosting environment.

### Netlify Deployment

1. Connect your repository:
   - Go to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Select your repository

2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

3. Set environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add all variables with `REACT_APP_` prefix for public variables

4. Deploy from terminal (alternative):
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Vercel Deployment

1. Connect your repository:
   - Go to [Vercel](https://vercel.com/)
   - Click "Import Project"
   - Select your repository

2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
   - Install command: `npm install`

3. Set environment variables:
   - Go to Project Settings > Environment Variables
   - Add all variables with `NEXT_PUBLIC_` prefix for public variables

4. Deploy from terminal (alternative):
   ```bash
   vercel --prod
   ```

### Multi-platform Support

The application automatically detects whether it's running on Netlify or Vercel:

```typescript
// From src/utils/apiUtils.ts
export const getApiEndpoint = (endpoint: string): string => {
  // Detect if running on Vercel
  const isVercel = process.env.VERCEL === '1' || window.location.hostname.includes('vercel.app');
  
  // If on Vercel, use /api routes
  if (isVercel) {
    const endpointName = endpoint.replace('/.netlify/functions/', '');
    return `/api/${endpointName}`;
  }
  
  // If on Netlify or local development, use Netlify functions path
  return endpoint.startsWith('/.netlify') ? endpoint : `/.netlify/functions/${endpoint}`;
};
```

This ensures that API endpoints are correctly routed regardless of the hosting platform.

For more details:
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Vercel API Routes Documentation](https://vercel.com/docs/functions/serverless-functions)

### Platform-Specific Configuration

Each platform uses different environment variable prefixes for public variables:

- **Netlify**: Uses `REACT_APP_` prefix
- **Vercel**: Uses `NEXT_PUBLIC_` prefix

Serverless functions are also named differently:
- Netlify: `/.netlify/functions/function-name`
- Vercel: `/api/function-name`

The application automatically handles these differences.

## Security Measures

The application implements several security measures:

### Input Validation & Sanitization

- Frontend and backend validation with regex patterns
- Content filtering for profanity, XSS, SQL injection attempts
- Length limits and character restrictions for inputs
- HTML and Markdown escaping for user-generated content

### Rate Limiting

- IP-based rate limiting (max 5 requests per 10 minutes per IP)
- Client-side rate limiting using local storage
- Progressive delays with [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) for repeated violations

### CAPTCHA Protection

- Google reCAPTCHA v2 integration on all forms
- Server-side token verification
- Environment variable configuration for site and secret keys

### CORS & Origin Validation

- Whitelist of allowed origins
- Referrer validation to check request source
- Dynamic CORS handling for development/production

### Anti-Bot Protection

- Honeypot fields to catch automated submissions
- User agent validation
- Behavioral analysis to detect suspicious patterns

### Security Best Practices

1. [Defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) with multiple security layers
2. Never trust user input, always validate
3. [Least privilege principle](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for all operations
4. Secure by default configurations
5. Regular dependency updates
6. Proper error handling without exposing sensitive information
7. Monitoring and logging for suspicious activities

For more information on web application security best practices, see the [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Content Security Policy

- [Strict CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to prevent XSS attacks
- Whitelist of trusted domains only
- Script restrictions with no inline scripts except necessary ones
- Frame protection to prevent [clickjacking](https://owasp.org/www-community/attacks/Clickjacking)

### Data Sanitization

- HTML escaping to prevent HTML injection
- Markdown escaping for safe Discord/Telegram message formatting
- Input trimming to remove unnecessary whitespace

### Security Headers

- [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options): Prevent MIME sniffing
- [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options): Prevent clickjacking
- [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection): Enable browser XSS filtering
- [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy): Control referrer information

For a comprehensive guide on security headers, see [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)

### Security Configuration

Rate Limiting Configuration:
- Window: 10 minutes
- Max Requests: 5 per IP
- Storage: In-memory (per serverless instance)

Content Validation Patterns:
- Profanity filtering
- XSS pattern detection
- SQL injection prevention
- URL/email spam detection
- Phone number spam prevention

### Monitoring & Alerts

What's Being Logged:
- Suspicious content attempts
- Rate limiting violations
- CAPTCHA failures
- Invalid requests
- Unusual traffic patterns

Alert Conditions:
- Multiple failed submissions from same IP
- Malicious content patterns detected
- Unusual traffic spikes
- CAPTCHA bypass attempts

### Security Maintenance

Regular Tasks:
- Review and update blacklist patterns
- Monitor error logs
- Update dependencies
- Review rate limiting effectiveness
- Test security measures

Updates Required:
- Environment variables rotation
- CAPTCHA key updates
- Security pattern updates
- Dependency updates

## Customization Guide

To customize the wedding invitation:

1. **Personal Information**:
   - Update names, dates, and locations in relevant components
   - Modify text content in language files

2. **Visual Elements**:
   - Replace images in `/public/images/` directory
   - Adjust colors and styles in CSS files
   - Modify animations in components

3. **Adding Features**:
   - Components are modular and can be added/removed in `App.tsx`
   - Adjust routes in `MainContentWrapper.tsx`

## Troubleshooting

- **RSVP/Guest Book not sent to Discord or Telegram:**
  - Check environment variables are correctly set
  - Verify webhook URL or bot token is valid
  - Check platform logs for detailed errors

- **reCAPTCHA errors:**
  - Ensure site key and secret key match
  - Verify domains are properly configured in reCAPTCHA admin
  - Check for rate limiting or network issues

- **Build failures:**
  - Verify Node.js version compatibility
  - Check for missing dependencies
  - Review platform-specific logs

- **API routes not working:**
  - Check for correct environment detection
  - Verify API paths are correct for the platform
  - Inspect network requests for detailed errors

## Development

### Available Scripts

- `npm start`: Run development server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App

### Node.js Version

Recommended Node.js versions: **16.x**, **18.x**, or **20.x**

## Maintenance

When maintaining this project, keep these guidelines in mind:

1. **Environment Variables**:
   - Ensure any new variables are added to both platforms
   - Remember the different prefixes for public variables

2. **API Routes**:
   - Keep the platform detection logic updated
   - Test on both platforms when modifying API endpoints

3. **Security Updates**:
   - Regularly update dependencies
   - Review and update security patterns
   - Monitor logs for potential issues

4. **Monitoring**:
   - Check logs for suspicious activities
   - Monitor rate limiting effectiveness
   - Test security measures periodically

## Contact

- GitHub: [jimbon25](https://github.com/jimbon25)
- Instagram: [@dimasladty](https://instagram.com/dimasladty)
- Facebook: [Dimas LA](https://facebook.com/iv.dimas)
- Report issues: [Create a new issue](https://github.com/jimbon25/wedding-invitation/issues/new)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- [Slick Carousel](https://kenwheeler.github.io/slick/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Discord](https://discord.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google reCAPTCHA](https://developers.google.com/recaptcha)
- [Google Gemini API](https://ai.google.dev/gemini-api)
