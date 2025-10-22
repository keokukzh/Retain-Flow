# Cloudflare Pages Deployment Guide

## 🚀 Complete Setup for RetainFlow on Cloudflare Pages

### Prerequisites
- Cloudflare account (free)
- GitHub repository connected
- Railway PostgreSQL database
- Environment variables configured

---

## Step 1: Environment Variables Setup

### Required Environment Variables

Set these in **Cloudflare Pages Dashboard** → Your Project → Settings → Environment Variables:

#### Production Variables:
```bash
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-32-character-random-string-here

# Optional (for future integrations)
STRIPE_SECRET_KEY=sk_live_...
DISCORD_BOT_TOKEN=your-discord-bot-token
EMAIL_SERVICE_API_KEY=re_...
```

#### GitHub Secrets (for CI/CD):
```bash
# In GitHub Repository → Settings → Secrets and Variables → Actions
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-32-character-random-string-here
```

---

## Step 2: Cloudflare Pages Project Setup

### 2.1 Create Project
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Choose your GitHub repository: `keokukzh/Retain-Flow`
5. Click **Begin setup**

### 2.2 Build Configuration
```
Project name: retain-flow-new
Production branch: main
Framework preset: Next.js
Build command: npm run pages:build
Build output directory: .next/static
Root directory: /
```

### 2.3 Environment Variables
Add all required environment variables in the Cloudflare Pages dashboard.

---

## Step 3: Railway Database Setup

### 3.1 Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Create new project: "RetainFlow"
3. Add PostgreSQL service
4. Copy the `DATABASE_URL` connection string

### 3.2 Run Database Migrations
```bash
# Set DATABASE_URL locally
export DATABASE_URL="your-railway-postgres-url"

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

---

## Step 4: GitHub Actions Setup

### 4.1 Get Cloudflare API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Custom token** template
4. Permissions:
   - `Account:Cloudflare Pages:Edit`
   - `Zone:Zone:Read`
5. Account Resources: Include `All accounts`
6. Copy the token

### 4.2 Get Account ID
1. In Cloudflare Dashboard, right sidebar shows **Account ID**
2. Copy this value

### 4.3 Add GitHub Secrets
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID
   - `DATABASE_URL`: Your Railway PostgreSQL URL
   - `JWT_SECRET`: Your JWT secret

---

## Step 5: Deployment Process

### 5.1 Automatic Deployment
- Push to `main` branch triggers automatic deployment
- GitHub Actions will build and deploy to Cloudflare Pages
- Check deployment status in GitHub Actions tab

### 5.2 Manual Deployment
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy manually
npm run deploy:prod
```

---

## Step 6: Custom Domain Setup

### 6.1 Add Custom Domain
1. In Cloudflare Pages → Your project
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `aidevelo.ai`
5. Click **Continue**

### 6.2 DNS Configuration
Cloudflare automatically configures:
- **A record**: `aidevelo.ai` → Cloudflare IP
- **CNAME**: `www.aidevelo.ai` → `aidevelo.ai`

---

## Step 7: Testing & Verification

### 7.1 Test Deployment
1. Visit your Cloudflare Pages URL
2. Test homepage loads: `/`
3. Test API endpoints: `/api/auth/login`
4. Test database connection
5. Test JWT authentication

### 7.2 Monitor Performance
- Cloudflare Analytics (built-in)
- Real User Monitoring (RUM)
- Core Web Vitals tracking

---

## Troubleshooting

### Build Failures
```bash
# Common issues:
# 1. Missing environment variables
# 2. TypeScript compilation errors
# 3. Missing dependencies
# 4. Prisma client not generated
```

**Solutions:**
1. Check all environment variables are set
2. Run `npm run type-check` locally
3. Run `npm run build` locally to test
4. Ensure `npx prisma generate` runs in CI

### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check Railway service status
# Ensure Prisma client is generated
```

### Domain Issues
```bash
# Check DNS propagation
# Verify SSL certificate status
# Test with curl: curl -I https://aidevelo.ai
```

---

## Project Structure

```
RetainFlow/
├── functions/api/          # Cloudflare Functions (Edge-optimized)
├── app/                    # Next.js App Router
├── lib/                    # Shared utilities
├── prisma/                 # Database schema
├── .github/workflows/      # CI/CD
├── wrangler.toml          # Cloudflare configuration
└── next.config.js         # Next.js configuration
```

---

## Benefits of This Setup

✅ **Edge-optimized**: Functions run at Cloudflare edge locations  
✅ **Cost-effective**: Cloudflare Pages free tier  
✅ **Auto-deployment**: GitHub integration  
✅ **Global CDN**: Fast loading worldwide  
✅ **Free SSL**: Automatic HTTPS  
✅ **DDoS Protection**: Built-in security  

---

## Next Steps After Deployment

1. **Set up monitoring** (Sentry, PostHog)
2. **Implement Stripe** for payments
3. **Add Discord bot** integration
4. **Set up email automation**
5. **Configure analytics** tracking
6. **Add security headers**
7. **Set up backup strategy**

---

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Railway Docs](https://docs.railway.app/)
- [Prisma Docs](https://www.prisma.io/docs/)

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for Cloudflare Pages
npm run pages:build

# Deploy to production
npm run deploy:prod

# Check deployment status
wrangler pages deployment list --project-name=retain-flow-new
```
