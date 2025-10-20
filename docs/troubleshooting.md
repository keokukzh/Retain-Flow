# RetainFlow Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### Login Not Working
**Symptoms:**
- "Invalid credentials" error
- Login form not submitting
- Redirect loops

**Solutions:**
1. Check email verification status
2. Verify password strength requirements
3. Clear browser cache and cookies
4. Check JWT token expiration
5. Verify database connection

```bash
# Check user in database
npx prisma studio

# Verify JWT secret
echo $JWT_SECRET

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Registration Fails
**Symptoms:**
- "User already exists" error
- Email validation errors
- Password requirements not met

**Solutions:**
1. Check email format validation
2. Verify password requirements (8+ chars, mixed case, numbers)
3. Check for existing user in database
4. Verify email service configuration

```bash
# Check email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

# Test registration endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'
```

### Database Issues

#### Connection Errors
**Symptoms:**
- "Database connection failed"
- Prisma client errors
- Migration failures

**Solutions:**
1. Verify DATABASE_URL format
2. Check database server status
3. Verify network connectivity
4. Check connection limits

```bash
# Test database connection
npx prisma db pull

# Check connection string format
postgresql://username:password@host:port/database

# Verify database is running
pg_isready -h localhost -p 5432
```

#### Migration Issues
**Symptoms:**
- Migration conflicts
- Schema drift
- Data loss during migration

**Solutions:**
1. Backup database before migration
2. Resolve migration conflicts
3. Reset and reapply migrations
4. Check for data type mismatches

```bash
# Reset database (development only)
npx prisma migrate reset

# Deploy migrations (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

### Integration Issues

#### Discord Bot Not Responding
**Symptoms:**
- Bot offline in Discord
- Commands not working
- Webhook events not received

**Solutions:**
1. Check bot token validity
2. Verify bot permissions
3. Check bot is in correct server
4. Review Discord API rate limits

```bash
# Test bot token
curl -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
  https://discord.com/api/v10/users/@me

# Check bot permissions
# Required: Send Messages, Manage Roles, Read Message History
```

#### Stripe Webhook Failures
**Symptoms:**
- Payment events not processed
- Subscription status not updated
- Webhook signature verification fails

**Solutions:**
1. Verify webhook endpoint URL
2. Check webhook signature validation
3. Ensure HTTPS endpoint
4. Review Stripe webhook logs

```bash
# Test webhook endpoint
curl -X POST https://aidevelo.ai/api/stripe/webhook \
  -H "Stripe-Signature: t=timestamp,v1=signature" \
  -d '{"type":"payment_intent.succeeded","data":{"object":{}}}'

# Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET
```

#### Email Service Issues
**Symptoms:**
- Emails not sending
- High bounce rates
- Delivery delays

**Solutions:**
1. Check API key validity
2. Verify sender domain
3. Review email templates
4. Check rate limits

```bash
# Test email service
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $EMAIL_SERVICE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"noreply@aidevelo.ai","to":"test@example.com","subject":"Test","html":"<p>Test email</p>"}'
```

### Performance Issues

#### Slow Page Loads
**Symptoms:**
- High loading times
- Poor Core Web Vitals
- Timeout errors

**Solutions:**
1. Optimize images and assets
2. Implement caching strategies
3. Check database query performance
4. Review CDN configuration

```bash
# Check bundle size
npm run build
npx @next/bundle-analyzer

# Analyze performance
npm run lighthouse

# Check database queries
npx prisma studio
```

#### High Memory Usage
**Symptoms:**
- Application crashes
- Slow response times
- Memory leaks

**Solutions:**
1. Review memory usage patterns
2. Check for memory leaks
3. Optimize database queries
4. Implement connection pooling

```bash
# Monitor memory usage
node --inspect server.js

# Check for memory leaks
npm install -g clinic
clinic doctor -- node server.js
```

### API Issues

#### Rate Limiting
**Symptoms:**
- "Rate limit exceeded" errors
- API requests failing
- Slow response times

**Solutions:**
1. Implement exponential backoff
2. Use batch operations
3. Cache frequently accessed data
4. Review rate limit configuration

```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### CORS Errors
**Symptoms:**
- "CORS policy" errors
- API requests blocked
- Preflight request failures

**Solutions:**
1. Configure CORS headers
2. Allow specific origins
3. Handle preflight requests
4. Review security policies

```javascript
// CORS configuration
const cors = require('cors');

app.use(cors({
  origin: ['https://aidevelo.ai', 'http://localhost:3000'],
  credentials: true
}));
```

### Frontend Issues

#### Build Failures
**Symptoms:**
- TypeScript errors
- ESLint violations
- Missing dependencies

**Solutions:**
1. Fix TypeScript errors
2. Resolve ESLint issues
3. Install missing dependencies
4. Check Node.js version

```bash
# Check for TypeScript errors
npm run type-check

# Fix ESLint issues
npm run lint:fix

# Install dependencies
npm install

# Check Node.js version
node --version
```

#### Component Rendering Issues
**Symptoms:**
- Components not displaying
- Hydration errors
- Styling issues

**Solutions:**
1. Check component imports
2. Verify props and state
3. Review CSS classes
4. Check for hydration mismatches

```bash
# Check for hydration errors
npm run dev
# Look for hydration warnings in console

# Verify component structure
npm run storybook
```

### Testing Issues

#### Test Failures
**Symptoms:**
- Unit tests failing
- E2E tests timing out
- Visual regression failures

**Solutions:**
1. Review test code
2. Check test data
3. Verify test environment
4. Update test snapshots

```bash
# Run specific test
npm test -- --testNamePattern="login test"

# Update snapshots
npm test -- --updateSnapshot

# Run E2E tests
npm run test:e2e
```

#### Visual Regression Issues
**Symptoms:**
- Screenshot differences
- Layout changes
- Styling inconsistencies

**Solutions:**
1. Review visual changes
2. Update reference images
3. Check responsive design
4. Verify browser compatibility

```bash
# Generate reference images
npx backstop reference

# Run visual tests
npx backstop test

# Approve changes
npx backstop approve
```

## Debug Tools

### Logging
```javascript
// Enable debug logging
process.env.DEBUG = 'retainflow:*';

// Custom logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Database Debugging
```bash
# Enable query logging
DATABASE_URL="postgresql://user:pass@host:5432/db?log=true"

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### API Debugging
```bash
# Enable request logging
DEBUG=express:router npm run dev

# Test API endpoints
curl -v http://localhost:3000/api/health

# Check response headers
curl -I http://localhost:3000/api/dashboard/stats
```

## Monitoring

### Health Checks
```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime()
  });
});
```

### Error Tracking
```javascript
// Sentry error tracking
const Sentry = require('@sentry/nextjs');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Capture exceptions
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### Performance Monitoring
```javascript
// Performance metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});
```

## Getting Help

### Support Channels
- **Email**: support@aidevelo.ai
- **Discord**: https://discord.gg/retainflow
- **GitHub Issues**: https://github.com/retainflow/issues
- **Documentation**: https://docs.aidevelo.ai

### Before Contacting Support
1. Check this troubleshooting guide
2. Review error logs
3. Test in different browsers/environments
4. Gather relevant information:
   - Error messages
   - Steps to reproduce
   - Browser/OS information
   - Network conditions

### Reporting Issues
When reporting issues, include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs
- Environment details
- Screenshots or videos if applicable

### Emergency Contacts
For critical production issues:
- **On-call Engineer**: +1-XXX-XXX-XXXX
- **Escalation**: engineering@aidevelo.ai
- **Status Page**: https://status.aidevelo.ai
