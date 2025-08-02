# Multi-platform Deployment

This wedding invitation website is designed to be deployed on both Netlify and Vercel platforms. The codebase automatically adapts to the hosting environment to ensure proper functionality on either platform.

## Platform Detection

The application uses environment detection to automatically adjust API endpoints:

```typescript
// From src/utils/apiUtils.ts
export const getApiEndpoint = (endpoint: string): string => {
  // Detect if running on Vercel
  const isVercel = process.env.VERCEL === '1' || window.location.hostname.includes('vercel.app');
  
  // If on Vercel, use /api routes
  if (isVercel) {
    // Extract endpoint name without Netlify path
    const endpointName = endpoint.replace('/.netlify/functions/', '');
    return `/api/${endpointName}`;
  }
  
  // If on Netlify or local development, use Netlify functions path
  return endpoint.startsWith('/.netlify') ? endpoint : `/.netlify/functions/${endpoint}`;
};
```

## Environment Variables

Different environment variable prefixes are used depending on the platform:

- **Netlify**: Uses `REACT_APP_` prefix for public variables
- **Vercel**: Uses `NEXT_PUBLIC_` prefix for public variables

For a complete list of required environment variables, see the [`.env.example`](.env.example) file.

## Deployment Instructions

For detailed deployment instructions, see the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

### Quick Start

1. Clone this repository
2. Copy `.env.local.example` to `.env.local` and fill in your values
3. Run `npm install` to install dependencies
4. Run `npm start` for local development

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

### Deploy to Vercel

```bash
vercel --prod
```

## Serverless Functions

The application uses serverless functions for backend operations:

- **RSVP & Guest Book**: Form submissions with reCAPTCHA verification
- **Discord & Telegram Notifications**: Real-time alerts for new submissions
- **Visitor Analytics**: Tracking through Telegram bot
- **Gemini AI Chat**: Providing interactive Q&A for guests

These functions are automatically deployed as Netlify Functions or Vercel API Routes based on the hosting platform.
