# Cloudflare Pages Deployment Guide

## 🚀 Deploy RetainFlow to Cloudflare Pages

### Prerequisites
- Cloudflare account (free)
- GitHub repository with RetainFlow code
- Railway account for database (PostgreSQL + Redis)

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

### 1.2 Verify Build Works
```bash
npm run build
# Should complete successfully
```

---

## Step 2: Cloudflare Pages Setup

### 2.1 Create Cloudflare Pages Project
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Pages"** in the sidebar
3. Click **"Create a project"**
4. Select **"Connect to Git"**
5. Choose your GitHub repository: `Retain-Flow`
6. Click **"Begin setup"**

### 2.2 Configure Build Settings
```
Project name: retainflow-prod
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

### 2.3 Environment Variables
Add these in Cloudflare Pages → Settings → Environment Variables:

**Required for Production:**
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://aidevelo.ai

# External Services (add as you implement them)
STRIPE_API_KEY=sk_live_...
DISCORD_BOT_TOKEN=your-discord-bot-token
EMAIL_SERVICE_API_KEY=re_...
```

---

## Step 3: Custom Domain Setup

### 3.1 Add Custom Domain
1. In Cloudflare Pages → Your project
2. Go to **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter: `aidevelo.ai`
5. Click **"Continue"**

### 3.2 DNS Configuration
Cloudflare will automatically configure DNS records:
- **A record**: `aidevelo.ai` → Cloudflare IP
- **CNAME**: `www.aidevelo.ai` → `aidevelo.ai`

### 3.3 SSL Certificate
- Cloudflare automatically provides free SSL
- HTTPS will be enabled automatically
- Certificate will be issued within 24 hours

---

## Step 4: Deploy

### 4.1 Automatic Deployment
Once connected to GitHub:
- Every push to `main` triggers automatic deployment
- Build logs available in Cloudflare Dashboard
- Preview deployments for pull requests

### 4.2 Manual Deployment (Alternative)
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy manually
npm run deploy:prod
```

---

## Step 5: Post-Deployment

### 5.1 Test Your Deployment
1. Visit `https://aidevelo.ai`
2. Test homepage loads
3. Test registration form
4. Test login functionality
5. Check dashboard (even with no data)

### 5.2 Monitor Performance
- Cloudflare Analytics (built-in)
- Real User Monitoring (RUM)
- Core Web Vitals tracking

### 5.3 Set Up Monitoring
```bash
# Add to environment variables
SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

---

## Step 6: Database Setup (Railway)

### 6.1 Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Create new project: "RetainFlow"
3. Add PostgreSQL service
4. Add Redis service

### 6.2 Get Connection Strings
Copy these from Railway dashboard:
- `DATABASE_URL` (PostgreSQL)
- `REDIS_URL` (Redis)

### 6.3 Run Migrations
```bash
# Set DATABASE_URL locally first
export DATABASE_URL="your-railway-postgres-url"

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

---

## Step 7: Advanced Configuration

### 7.1 Edge Functions (Optional)
For serverless API routes, you can use Cloudflare Workers:
```javascript
// functions/api/auth/login.js
export async function onRequest(context) {
  // Your API logic here
}
```

### 7.2 Caching Strategy
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ];
  },
};
```

### 7.3 Performance Optimization
- Enable Cloudflare's Auto Minify
- Enable Brotli compression
- Configure caching rules
- Use Cloudflare Images for optimization

---

## Troubleshooting

### Build Failures
```bash
# Check build logs in Cloudflare Dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

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

## Benefits of Cloudflare Pages

✅ **Global CDN**: Fast loading worldwide  
✅ **Free SSL**: Automatic HTTPS  
✅ **DDoS Protection**: Built-in security  
✅ **Edge Functions**: Serverless compute  
✅ **Analytics**: Performance monitoring  
✅ **Git Integration**: Automatic deployments  
✅ **Preview Deployments**: Test before production  
✅ **Custom Domains**: Easy domain management  

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
