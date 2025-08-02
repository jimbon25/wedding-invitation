# Deployment Guide

This document outlines the steps to deploy the Wedding Invitation website on both Netlify and Vercel platforms.

## Environment Variables

### Required Environment Variables

| Variable Name | Netlify | Vercel | Description |
|---------------|---------|--------|-------------|
| `RECAPTCHA_SECRET_KEY` | ✅ | ✅ | Secret key for reCAPTCHA verification |
| `TELEGRAM_BOT_TOKEN` | ✅ | ✅ | Token for the Telegram notification bot |
| `TELEGRAM_CHAT_ID` | ✅ | ✅ | Chat ID where notifications are sent |
| `ANALYTICS_BOT_TOKEN` | ✅ | ✅ | Token for visitor analytics bot |
| `ANALYTICS_CHAT_ID` | ✅ | ✅ | Chat ID for visitor analytics |
| `DISCORD_WEBHOOK_URL` | ✅ | ✅ | Discord webhook for notifications |
| `GEMINI_API_KEY` | ✅ | ✅ | API key for Gemini AI chat assistant |
| `GUEST_API_KEY` | ✅ | ✅ | API key for guest authentication |
| `REACT_APP_RECAPTCHA_SITE_KEY` | ✅ | ❌ | Public reCAPTCHA key (Netlify) |
| `REACT_APP_GUEST_API_KEY` | ✅ | ❌ | Public guest API key (Netlify) |
| `REACT_APP_SITE_URL` | ✅ | ❌ | Site URL for Netlify |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ❌ | ✅ | Public reCAPTCHA key (Vercel) |
| `NEXT_PUBLIC_GUEST_API_KEY` | ❌ | ✅ | Public guest API key (Vercel) |
| `NEXT_PUBLIC_SITE_URL` | ❌ | ✅ | Site URL for Vercel |

### Netlify Specific Setup

1. Add environment variables in the Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add all the required variables listed above with the `REACT_APP_` prefix for public variables

2. Deploy from Git repository:
   ```
   netlify deploy --prod
   ```

### Vercel Specific Setup

1. Add environment variables in the Vercel dashboard:
   - Go to Project settings > Environment Variables
   - Add all the required variables listed above with the `NEXT_PUBLIC_` prefix for public variables

2. Deploy from Git repository:
   ```
   vercel --prod
   ```

## API Routes

The project uses serverless functions/API routes for backend functionality:

1. **send-telegram-message.js / send-discord-message.js**
   - Handles RSVP form submissions
   - Verifies reCAPTCHA token
   - Sends notifications to Telegram/Discord

2. **verify-recaptcha.js**
   - Validates reCAPTCHA tokens

3. **guest-count.js**
   - Tracks visitor analytics
   - Sends data to a dedicated Telegram bot

4. **gemini-chat.js**
   - Powers the AI chat assistant for wedding guests

## Platform Detection

The frontend automatically detects whether it's running on Netlify or Vercel and uses the appropriate environment variables and API paths. This is handled by utility functions in the codebase.

## Troubleshooting

If you encounter issues with API routes:

1. Check environment variables are correctly set
2. Verify API route paths are correct:
   - Netlify: `/.netlify/functions/function-name`
   - Vercel: `/api/function-name`
3. Check logs in the respective platform's dashboard

## Maintenance

When updating the codebase, ensure:

1. Any new environment variables are added to both platforms
2. API routes are compatible with both platforms
3. Frontend code uses the correct environment detection for API calls
