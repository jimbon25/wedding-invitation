# Security Documentation

## Security Measures Implemented

### 1. Input Validation & Sanitization
- **Frontend Validation**: Real-time validation with regex patterns
- **Backend Validation**: Server-side validation with enhanced security patterns
- **Content Filtering**: Blacklist patterns for profanity, XSS, SQL injection attempts
- **Length Limits**: Name (50 chars), Message (300 chars)
- **Character Restrictions**: Only allow safe characters in names

### 2. Rate Limiting
- **IP-based Rate Limiting**: Max 5 requests per 10 minutes per IP
- **Client-side Rate Limiting**: LocalStorage-based attempt tracking
- **Progressive Delays**: Exponential backoff for repeated violations

### 3. CAPTCHA Protection
- **Google reCAPTCHA v2**: All forms protected with reCAPTCHA
- **Environment Variables**: Site key configurable via environment
- **Server-side Verification**: Backend verification of CAPTCHA tokens

### 4. Content Security Policy (CSP)
- **Strict CSP Headers**: Prevent XSS attacks
- **Allowed Sources**: Whitelist trusted domains only
- **Script Restrictions**: No inline scripts except necessary ones
- **Frame Protection**: Prevent clickjacking

### 5. CORS & Origin Validation
- **Whitelist Origins**: Only allowed domains can make requests
- **Dynamic CORS**: Flexible origin handling for development/production
- **Referrer Validation**: Check request source

### 6. Anti-Bot Protection
- **Honeypot Fields**: Hidden fields to catch bots
- **User Agent Validation**: Basic bot detection
- **Behavioral Analysis**: Detect suspicious patterns

### 7. Data Sanitization
- **HTML Escaping**: Prevent HTML injection
- **Markdown Escaping**: Safe Discord/Telegram message formatting
- **Input Trimming**: Remove unnecessary whitespace

### 8. Security Headers
- **X-Content-Type-Options**: Prevent MIME sniffing
- **X-Frame-Options**: Prevent clickjacking
- **X-XSS-Protection**: Enable browser XSS filtering
- **Referrer-Policy**: Control referrer information

## Security Configuration

### Environment Variables
```bash
# Frontend (Public)
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
REACT_APP_GUEST_API_KEY=your_guest_api_key
REACT_APP_SITE_URL=https://your-domain.com

# Backend (Private)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
DISCORD_WEBHOOK_URL=your_discord_webhook
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

### Rate Limiting Configuration
- **Window**: 10 minutes
- **Max Requests**: 5 per IP
- **Storage**: In-memory (per serverless instance)

### Content Validation Patterns
- Profanity filtering
- XSS pattern detection
- SQL injection prevention
- URL/email spam detection
- Phone number spam prevention

## Security Best Practices Followed

1. **Defense in Depth**: Multiple layers of security
2. **Input Validation**: Never trust user input
3. **Least Privilege**: Minimal permissions required
4. **Secure by Default**: Safe configurations
5. **Regular Updates**: Keep dependencies updated
6. **Error Handling**: Don't expose sensitive information
7. **Logging**: Track suspicious activities

## Monitoring & Alerts

### What's Being Logged
- Suspicious content attempts
- Rate limiting violations
- CAPTCHA failures
- Invalid requests
- Unusual traffic patterns

### Alert Conditions
- Multiple failed submissions from same IP
- Malicious content patterns detected
- Unusual traffic spikes
- CAPTCHA bypass attempts

## Security Testing Checklist

- [ ] Test CAPTCHA validation
- [ ] Test rate limiting
- [ ] Test input validation
- [ ] Test XSS prevention
- [ ] Test SQL injection prevention
- [ ] Test CORS configuration
- [ ] Test CSP headers
- [ ] Test honeypot fields

## Incident Response

1. **Detection**: Monitor logs for suspicious activities
2. **Assessment**: Evaluate threat level
3. **Containment**: Block malicious IPs if needed
4. **Recovery**: Restore normal operations
5. **Lessons**: Update security measures

## Security Maintenance

### Regular Tasks
- Review and update blacklist patterns
- Monitor error logs
- Update dependencies
- Review rate limiting effectiveness
- Test security measures

### Updates Required
- Environment variables rotation
- CAPTCHA key updates
- Security pattern updates
- Dependency updates

## Contact for Security Issues

For security vulnerabilities or concerns, please contact the development team immediately.

## Compliance Notes

This application implements security measures appropriate for a wedding invitation website, balancing security with user experience. The measures are proportionate to the data sensitivity and threat model.
