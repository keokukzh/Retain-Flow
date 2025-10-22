// Stripe setup script to create products and prices
const stripe = require('stripe')('sk_test_...'); // Replace with your secret key

async function createProducts() {
  try {
    // Create RetainFlow Pro product
    const product = await stripe.products.create({
      name: 'RetainFlow Pro',
      description: 'Advanced retention automation with Discord, Whop, and Shopify integrations',
      metadata: {
        plan: 'pro',
        features: 'discord,whop,shopify,analytics'
      }
    });

    console.log('Product created:', product.id);

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product.id,
      metadata: {
        plan: 'pro',
        interval: 'monthly'
      }
    });

    console.log('Monthly price created:', monthlyPrice.id);

    // Create yearly price
    const yearlyPrice = await stripe.prices.create({
      unit_amount: 49000, // $490.00 (save $98/year)
      currency: 'usd',
      recurring: { interval: 'year' },
      product: product.id,
      metadata: {
        plan: 'pro',
        interval: 'yearly'
      }
    });

    console.log('Yearly price created:', yearlyPrice.id);

    console.log('\n=== Environment Variables ===');
    console.log('STRIPE_SECRET_KEY=sk_test_...');
    console.log('STRIPE_WEBHOOK_SECRET=whsec_ee2e5b786174555d01b1c457305ae593dbbeca52d23075a3c111fc3c99765495');
    console.log(`STRIPE_PRICE_ID_PRO_MONTHLY=${monthlyPrice.id}`);
    console.log(`STRIPE_PRICE_ID_PRO_YEARLY=${yearlyPrice.id}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createProducts();
