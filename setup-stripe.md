# Stripe Setup Instructions

## 1. Get Your Stripe API Keys



To get your **Secret Key**:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)

## 2. Create Products and Prices

Run these commands in your terminal (make sure Stripe CLI is working):

```bash
# Create RetainFlow Pro product
stripe products create --name "RetainFlow Pro" --description "Advanced retention automation with Discord, Whop, and Shopify integrations"

# Note the product ID from the output, then create prices:
# Replace PRODUCT_ID with the actual ID from above command

# Monthly price ($49/month)
stripe prices create --product PRODUCT_ID --unit-amount 4900 --currency usd --recurring interval=month

# Yearly price ($490/year - save $98)
stripe prices create --product PRODUCT_ID --unit-amount 49000 --currency usd --recurring interval=year
```

## 3. Environment Variables for Cloudflare Pages

Set these in your Cloudflare Pages project settings:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_ee2e5b786174555d01b1c457305ae593dbbeca52d23075a3c111fc3c99765495
STRIPE_PRICE_ID_PRO_MONTHLY=price_your_monthly_price_id_here
STRIPE_PRICE_ID_PRO_YEARLY=price_your_yearly_price_id_here
PUBLIC_URL=https://aidevelo.ai
JWT_SECRET=your_jwt_secret_here
```

## 4. Test Webhook

With Stripe CLI listening (`stripe listen`), test the webhook:

```bash
stripe trigger checkout.session.completed
```

This will send a test webhook to your local endpoint and you can verify it's working.

## 5. Deploy and Test

After setting environment variables, deploy and test the checkout flow:

1. Go to your dashboard
2. Click "Upgrade to Pro" 
3. Complete the Stripe checkout
4. Verify webhook events are received
