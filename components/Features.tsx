'use client';

import FeatureCard from './FeatureCard';
import { BoltIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to reduce churn</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Powerful, simple, and built for creators. Connect your platforms and let AI do the heavy lifting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<BoltIcon className="w-6 h-6" />}
            title="Plug & Play Integrations"
            description="Connect Discord, Whop, and Shopify in minutes. No code required."
          />
          <FeatureCard
            icon={<SparklesIcon className="w-6 h-6" />}
            title="AI-Powered Prediction"
            description="Predict churn before it happens and trigger the right action at the right time."
          />
          <FeatureCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            title="Actionable Analytics"
            description="Understand what drives retention and measure the impact of your campaigns."
          />
        </div>
      </div>
    </section>
  );
}


