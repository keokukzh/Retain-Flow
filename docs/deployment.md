# RetainFlow Deployment Guide

## Overview

This guide covers the deployment process for RetainFlow, including environment setup, configuration, and deployment to production.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Vercel account
- Railway account
- Domain configured (aidevelo.ai)

## Environment Setup

### 1. Environment Variables

Create environment files for different stages:

#### Development (.env.local)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/retainflow_dev"

# JWT Authentication
JWT_SECRET="your-development-jwt-secret"

# Stripe (Test Mode)
STRIPE_API_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Discord Bot (Development)
DISCORD_BOT_TOKEN="your-dev-bot-token"
DISCORD_CLIENT_ID="your-dev-client-id"

# Email Service
EMAIL_SERVICE_API_KEY="re_dev_..."

# Redis
REDIS_URL="redis://localhost:6379"

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

#### Production (.env.production)
```bash
# Database
DATABASE_URL="postgresql://username:password@production-host:5432/retainflow"

# JWT Authentication
JWT_SECRET="your-production-jwt-secret"

# Stripe (Live Mode)
STRIPE_API_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Discord Bot (Production)
DISCORD_BOT_TOKEN="your-prod-bot-token"
DISCORD_CLIENT_ID="your-prod-client-id"

# Email Service
EMAIL_SERVICE_API_KEY="re_live_..."

# Redis
REDIS_URL="redis://production-redis:6379"

# Application
NEXTAUTH_URL="https://aidevelo.ai"
NEXTAUTH_SECRET="your-production-nextauth-secret"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
POSTHOG_KEY="your-posthog-key"
```

### 2. Database Setup

#### Local Development
```bash
# Install PostgreSQL
# Create database
createdb retainflow_dev

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

#### Production Database (Railway)
1. Create new PostgreSQL service in Railway
2. Copy connection string to DATABASE_URL
3. Run migrations:
```bash
npx prisma migrate deploy
```

### 3. Redis Setup

#### Local Development
```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

#### Production Redis (Railway)
1. Create new Redis service in Railway
2. Copy connection string to REDIS_URL

## Deployment Process

### 1. Vercel Deployment (Frontend & API)

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

#### Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "STRIPE_API_KEY": "@stripe-api-key",
    "DISCORD_BOT_TOKEN": "@discord-bot-token",
    "EMAIL_SERVICE_API_KEY": "@email-service-api-key",
    "REDIS_URL": "@redis-url"
  }
}
```

#### Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 2. Railway Deployment (Backend Services)

#### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link
```

#### Deploy
```bash
# Deploy to staging
railway up --environment staging

# Deploy to production
railway up --environment production
```

### 3. Database Migrations

#### Development
```bash
# Create migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset
```

#### Production
```bash
# Deploy migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci.yml`:

1. **Test Stage**
   - Install dependencies
   - Run linting
   - Execute unit tests
   - Run type checking

2. **Build Stage**
   - Build application
   - Generate Prisma client
   - Create build artifacts

3. **Visual Testing**
   - Run visual regression tests
   - Generate screenshots
   - Compare with baseline

4. **E2E Testing**
   - Deploy to staging
   - Run end-to-end tests
   - Generate test reports

5. **Deployment**
   - Deploy to staging (develop branch)
   - Deploy to production (main branch)
   - Send notifications

### Manual Deployment

#### Staging Deployment
```bash
# Trigger staging deployment
git push origin develop

# Or manually deploy
vercel --target staging
```

#### Production Deployment
```bash
# Trigger production deployment
git push origin main

# Or manually deploy
vercel --prod
```

## Monitoring & Observability

### 1. Error Tracking (Sentry)

#### Setup
```bash
npm install @sentry/nextjs
```

#### Configuration
```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics (PostHog)

#### Setup
```bash
npm install posthog-js
```

#### Configuration
```javascript
// lib/analytics.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}
```

### 3. Uptime Monitoring

#### Vercel Analytics
- Built-in performance monitoring
- Real user monitoring
- Core Web Vitals tracking

#### External Monitoring
- UptimeRobot for uptime monitoring
- Pingdom for performance monitoring
- Status page for public status

## Security

### 1. Environment Variables
- Store secrets in Vercel/Railway environment variables
- Never commit secrets to repository
- Use different secrets for each environment

### 2. Database Security
- Use connection pooling
- Enable SSL connections
- Regular security updates
- Backup encryption

### 3. API Security
- Rate limiting on all endpoints
- CORS configuration
- Input validation
- SQL injection prevention

### 4. Webhook Security
- Verify webhook signatures
- Use HTTPS endpoints
- Implement idempotency
- Log all webhook events

## Performance Optimization

### 1. Frontend Optimization
- Image optimization with Next.js Image
- Code splitting and lazy loading
- CDN for static assets
- Service worker for caching

### 2. Backend Optimization
- Database query optimization
- Redis caching
- Connection pooling
- Background job processing

### 3. CDN Configuration
- Vercel Edge Network
- Static asset caching
- API response caching
- Geographic distribution

## Backup & Recovery

### 1. Database Backups
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20240101.sql
```

### 2. File Storage Backups
- Vercel automatic backups
- External backup service
- Cross-region replication

### 3. Disaster Recovery
- Multi-region deployment
- Automated failover
- Recovery procedures
- RTO/RPO targets

## Troubleshooting

### Common Issues

#### Build Failures
1. Check environment variables
2. Verify dependencies
3. Review build logs
4. Test locally

#### Database Connection Issues
1. Verify connection string
2. Check network connectivity
3. Review database logs
4. Test connection manually

#### Webhook Failures
1. Check webhook URL accessibility
2. Verify signature validation
3. Review webhook logs
4. Test webhook manually

### Debug Commands

```bash
# Check application status
vercel ls

# View deployment logs
vercel logs

# Check database connection
npx prisma db pull

# Test webhook endpoint
curl -X POST https://aidevelo.ai/api/webhook/test
```

### Support

For deployment issues:
- Check Vercel status page
- Review Railway status
- Contact platform support
- Submit issue to repository

## Maintenance

### Regular Tasks

#### Daily
- Monitor error rates
- Check system health
- Review performance metrics

#### Weekly
- Update dependencies
- Review security alerts
- Backup verification

#### Monthly
- Security audit
- Performance review
- Capacity planning
- Cost optimization

### Updates

#### Application Updates
```bash
# Update dependencies
npm update

# Run tests
npm test

# Deploy updates
git push origin main
```

#### Infrastructure Updates
- Monitor platform updates
- Plan maintenance windows
- Test updates in staging
- Coordinate deployments
