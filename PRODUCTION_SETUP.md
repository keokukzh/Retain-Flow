# Production Setup Guide - RetainFlow

This guide will help you configure all required API credentials for production deployment.

## Prerequisites

- Cloudflare Pages project: `retainflow-prod`
- Access to Google Cloud Console
- Access to Discord Developer Portal
- Stripe account (Live mode)

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project (or create a new one)
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Choose "Web application"
5. Add these Authorized redirect URIs:
   - `https://2f17e891.retainflow-prod.pages.dev/api/auth/oauth/google/callback`
   - `https://aidevelo.ai/api/auth/oauth/google/callback` (for custom domain)
6. Copy the **Client ID** and **Client Secret**

### Step 2: Set Environment Variables
In Cloudflare Pages → retainflow-prod → Settings → Environment Variables:
- `GOOGLE_CLIENT_ID` = your_client_id_here
- `GOOGLE_CLIENT_SECRET` = your_client_secret_here

---

## 2. Discord OAuth Setup

### Step 1: Create Discord Application
1. Go to: https://discord.com/developers/applications
2. Click "New Application"
3. Enter name: "RetainFlow"
4. Go to "OAuth2" → "General"
5. Copy the **Client ID** and **Client Secret**
6. In "Redirects" section, add:
   - `https://2f17e891.retainflow-prod.pages.dev/api/auth/oauth/discord/callback`
   - `https://aidevelo.ai/api/auth/oauth/discord/callback` (for custom domain)

### Step 2: Set Environment Variables
In Cloudflare Pages → retainflow-prod → Settings → Environment Variables:
- `DISCORD_CLIENT_ID` = your_discord_client_id
- `DISCORD_CLIENT_SECRET` = your_discord_client_secret

---

## 3. Stripe Live Mode Setup

### Step 1: Get Stripe Live Keys
1. Go to: https://dashboard.stripe.com/apikeys
2. **Toggle to "Live mode"** (important!)
3. Copy the **Secret key** (starts with `sk_live_...`)

### Step 2: Create Products and Prices
1. Go to: https://dashboard.stripe.com/products
2. Click "Add product"
3. **Product 1 - Monthly:**
   - Name: "RetainFlow Pro Monthly"
   - Price: $49.00 USD
   - Billing period: Monthly
   - Copy the **Price ID** (starts with `price_...`)
4. **Product 2 - Yearly:**
   - Name: "RetainFlow Pro Yearly"
   - Price: $490.00 USD
   - Billing period: Yearly
   - Copy the **Price ID** (starts with `price_...`)

### Step 3: Setup Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://2f17e891.retainflow-prod.pages.dev/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 4: Set Environment Variables
In Cloudflare Pages → retainflow-prod → Settings → Environment Variables:
- `STRIPE_SECRET_KEY` = sk_live_your_secret_key
- `STRIPE_PRICE_ID_PRO_MONTHLY` = price_your_monthly_price_id
- `STRIPE_PRICE_ID_PRO_YEARLY` = price_your_yearly_price_id
- `STRIPE_WEBHOOK_SECRET` = whsec_your_webhook_secret

---

## 4. Other Required Variables

### JWT Secret
Generate a secure random string (32+ characters):
- Use: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
- Or generate with: `openssl rand -base64 32`

### Public URL
Set your domain:
- `PUBLIC_URL` = https://2f17e891.retainflow-prod.pages.dev
- Later change to: `https://aidevelo.ai` (when custom domain is connected)

---

## 5. Cloudflare Pages Configuration

### Set All Environment Variables
Go to: Cloudflare Pages → retainflow-prod → Settings → Environment Variables → Production

Add these variables:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PRICE_ID_PRO_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_ID_PRO_YEARLY=price_your_yearly_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
JWT_SECRET=your_32_character_random_string
PUBLIC_URL=https://2f17e891.retainflow-prod.pages.dev
```

### Trigger New Deployment
After setting all variables:
1. Go to Cloudflare Pages → retainflow-prod → Deployments
2. Click "Retry deployment" on the latest deployment
3. Or push a new commit to trigger automatic deployment

---

## 6. Testing Checklist

### Google OAuth Test
- [ ] Go to: https://2f17e891.retainflow-prod.pages.dev/login
- [ ] Click "Sign up with Google"
- [ ] Complete Google OAuth flow
- [ ] Verify redirect to dashboard
- [ ] Check that user is logged in

### Discord OAuth Test
- [ ] Go to: https://2f17e891.retainflow-prod.pages.dev/login
- [ ] Click "Sign up with Discord"
- [ ] Complete Discord OAuth flow
- [ ] Verify redirect to dashboard
- [ ] Check that user is logged in

### Stripe Checkout Test
- [ ] Go to: https://2f17e891.retainflow-prod.pages.dev/dashboard
- [ ] Click "Upgrade to Pro ($49/mo)"
- [ ] Complete Stripe checkout with test card: `4242 4242 4242 4242`
- [ ] Verify redirect to dashboard with success message
- [ ] Check Stripe dashboard for new subscription

### Stripe Portal Test
- [ ] After successful checkout, click "Manage Billing"
- [ ] Verify redirect to Stripe Customer Portal
- [ ] Test subscription management features

### Webhook Test
- [ ] Check Stripe webhook logs for successful events
- [ ] Verify webhook endpoint receives events
- [ ] Check for any webhook failures

---

## 7. Troubleshooting

### Common Issues

**"OAuth not configured" error:**
- Verify environment variables are set in Cloudflare Pages
- Check that redirect URIs match exactly
- Ensure you're using the correct Client ID/Secret

**"Stripe not configured" error:**
- Verify STRIPE_SECRET_KEY is set (starts with `sk_live_`)
- Check that price IDs are correct
- Ensure webhook endpoint URL is correct

**Webhook failures:**
- Check webhook URL is accessible
- Verify webhook secret matches
- Check Cloudflare Pages function logs

### Support
If you encounter issues:
1. Check Cloudflare Pages function logs
2. Verify all environment variables are set
3. Test each service individually
4. Check redirect URIs match exactly

---

## 8. Security Notes

- Never commit API keys to git
- Use environment variables for all secrets
- Regularly rotate JWT secrets
- Monitor webhook endpoints for abuse
- Use HTTPS for all redirect URIs

---

## 9. Next Steps

After successful setup:
1. Test all OAuth flows
2. Test Stripe checkout and portal
3. Set up monitoring and alerts
4. Configure custom domain (aidevelo.ai)
5. Set up analytics and logging
