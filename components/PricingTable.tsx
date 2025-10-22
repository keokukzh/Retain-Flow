'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  cta: string;
  href: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with basic retention tools',
    features: [
      'Up to 50 members',
      'Basic churn prediction',
      'Email notifications',
      'Discord bot (limited)',
      'Community support',
    ],
    limitations: [
      'No advanced analytics',
      'No custom integrations',
      'Limited automation',
    ],
    cta: 'Get Started Free',
    href: '/register?plan=free',
  },
  {
    name: 'Pro',
    price: 49,
    period: 'month',
    description: 'Ideal for growing creator communities',
    features: [
      'Up to 500 members',
      'Advanced AI churn prediction',
      'Full Discord integration',
      'Whop & Shopify sync',
      'Automated retention campaigns',
      'Priority support',
      'Custom retention offers',
      'Analytics dashboard',
    ],
    limitations: [
      'No white-label options',
      'Limited API access',
    ],
    popular: true,
    cta: 'Start Pro Trial',
    href: '/register?plan=pro',
  },
  {
    name: 'Growth',
    price: 199,
    period: 'month',
    description: 'For established creators and agencies',
    features: [
      'Up to 10,000 members',
      'Enterprise AI models',
      'All integrations included',
      'White-label options',
      'Full API access',
      'Custom automations',
      'Dedicated support',
      'Advanced analytics',
      'Team collaboration',
      'Custom branding',
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/contact?plan=growth',
  },
];

export default function PricingTable() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Free';

    const yearlyDiscount = 0.2; // 20% discount for yearly
    if (billingPeriod === 'yearly') {
      const perMonth = (plan.price * (1 - yearlyDiscount));
      return `$${perMonth.toFixed(2)}`; // e.g., $39.20
    }
    return `$${plan.price}`;
  };

  const getYearlySavings = (plan: Plan) => {
    if (plan.price === 0) return null;
    const yearlyPrice = plan.price * 12 * 0.8; // 20% discount
    const monthlyPrice = plan.price * 12;
    const savings = monthlyPrice - yearlyPrice;
    return `Save $${Math.round(savings)}/year`;
  };

  const handleSubscribe = async (plan: Plan) => {
    if (plan.price === 0) {
      // Free plan - redirect to signup
      window.location.href = '/register';
      return;
    }

    setLoading(plan.name);

    try {
      // Get price ID based on plan and billing period
      const priceId = getPriceId(plan.name, billingPeriod);
      
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user-id', // In real app, get from auth context
          priceId,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      // console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getPriceId = (planName: string, period: 'monthly' | 'yearly') => {
    // These would be your actual Stripe Price IDs
    const priceIds: Record<string, Record<string, string>> = {
      'Pro': {
        monthly: 'price_pro_monthly',
        yearly: 'price_pro_yearly',
      },
      'Growth': {
        monthly: 'price_growth_monthly',
        yearly: 'price_growth_yearly',
      },
    };

    return priceIds[planName]?.[period] || 'price_default';
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your community size. All plans include our core retention features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-transform ${
                plan.popular
                  ? 'border-primary-500 ring-2 ring-primary-500/20 md:scale-105 shadow-xl'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {getPrice(plan)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingPeriod === 'yearly' ? 'month billed yearly' : plan.period}
                    </span>
                  )}
                </div>

                {billingPeriod === 'yearly' && getYearlySavings(plan) && (
                  <p className="text-green-600 text-sm font-medium">
                    {getYearlySavings(plan)}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start opacity-60">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
                className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white btn-glow'
                    : plan.name === 'Free'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {loading === plan.name ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my member limit?
              </h4>
              <p className="text-gray-600">
                We&apos;ll notify you when you&apos;re approaching your limit. You can upgrade your plan or we&apos;ll help you optimize your retention.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Yes! Start with our free plan or try Pro for 14 days with full access to all features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
