# Production Environment Variables

## Required Environment Variables for Deployment

### Database & Redis
```bash
# PostgreSQL Database (from Railway)
DATABASE_URL="postgresql://username:password@host:port/database"

# Redis (from Railway) 
REDIS_URL="redis://username:password@host:port"
```

### Authentication & Security
```bash
# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secure-jwt-secret-here"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://aidevelo.ai"
```

### External Services
```bash
# Stripe (for subscriptions and payments)
STRIPE_API_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Discord Bot
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Email Service (Resend)
EMAIL_SERVICE_API_KEY="re_..."

# Whop Integration
WHOP_API_KEY="your-whop-api-key"
WHOP_WEBHOOK_SECRET="your-whop-webhook-secret"

# Shopify Integration
SHOPIFY_API_KEY="your-shopify-api-key"
SHOPIFY_API_SECRET="your-shopify-api-secret"
SHOPIFY_WEBHOOK_SECRET="your-shopify-webhook-secret"
```

### Monitoring & Analytics
```bash
# Sentry (error tracking)
SENTRY_DSN="https://..."

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### Deployment
```bash
# Cloudflare Pages
NEXT_PUBLIC_CF_PAGES_URL="https://aidevelo.ai"

# Chromatic (visual testing)
NEXT_PUBLIC_CHROMATIC_PROJECT_TOKEN="your-chromatic-token"
```

## Environment Variables Setup Instructions

### 1. Generate Secure Secrets
```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate NextAuth Secret  
openssl rand -base64 32
```

### 2. Railway Setup
1. Go to [Railway.app](https://railway.app)
2. Create new project: "RetainFlow"
3. Add PostgreSQL service
4. Add Redis service
5. Copy connection strings

### 3. Cloudflare Pages Environment Variables
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select "Pages" → Your project
3. Go to Settings → Environment Variables
4. Add all variables above
5. Set production environment for all

### 4. Service API Keys
- **Stripe**: Get from [Stripe Dashboard](https://dashboard.stripe.com)
- **Discord**: Create bot at [Discord Developer Portal](https://discord.com/developers/applications)
- **Resend**: Get from [Resend Dashboard](https://resend.com)
- **Whop**: Get from [Whop API](https://whop.com/api)
- **Shopify**: Get from [Shopify Partners](https://partners.shopify.com)
- **Sentry**: Get from [Sentry Dashboard](https://sentry.io)
- **PostHog**: Get from [PostHog Dashboard](https://posthog.com)

## Security Notes
- Never commit `.env` files to git
- Use different secrets for development and production
- Rotate secrets regularly
- Use environment-specific API keys
- Enable 2FA on all service accounts
