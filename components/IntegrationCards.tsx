'use client';

import { useState } from 'react';
// import Image from 'next/image'; // Temporarily disabled for deployment

interface Integration {
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'available' | 'coming-soon';
  features: string[];
}

const integrations: Integration[] = [
  {
    name: 'Discord',
    description: 'Seamlessly integrate with your Discord server for automated welcome messages, role assignments, and community engagement tracking.',
    logo: '/integrations/discord.svg',
    status: 'available',
    features: [
      'Automated welcome messages',
      'Role-based retention campaigns',
      'Activity tracking',
      'Custom bot commands',
      'Member engagement analytics',
    ],
  },
  {
    name: 'Whop',
    description: 'Sync your Whop memberships and automatically trigger retention campaigns based on subscription status and engagement.',
    logo: '/integrations/whop.svg',
    status: 'available',
    features: [
      'Membership sync',
      'Payment status tracking',
      'Automated renewal reminders',
      'Churn prediction',
      'Custom retention offers',
    ],
  },
  {
    name: 'Shopify',
    description: 'Connect your Shopify store to track digital product subscriptions and implement retention strategies for your customers.',
    logo: '/integrations/shopify.svg',
    status: 'available',
    features: [
      'Digital product tracking',
      'Customer behavior analysis',
      'Subscription management',
      'Automated follow-ups',
      'Revenue optimization',
    ],
  },
  {
    name: 'Patreon',
    description: 'Integrate with Patreon to manage your creator subscriptions and implement advanced retention strategies.',
    logo: '/integrations/patreon.svg',
    status: 'coming-soon',
    features: [
      'Tier-based retention',
      'Creator analytics',
      'Fan engagement tracking',
      'Revenue insights',
      'Automated campaigns',
    ],
  },
  {
    name: 'Gumroad',
    description: 'Connect your Gumroad products to track customer lifetime value and implement retention campaigns.',
    logo: '/integrations/gumroad.svg',
    status: 'coming-soon',
    features: [
      'Product performance tracking',
      'Customer segmentation',
      'Automated email sequences',
      'Revenue analytics',
      'Churn prevention',
    ],
  },
  {
    name: 'API',
    description: 'Build custom integrations with our comprehensive REST API and webhook system.',
    logo: '/integrations/api.svg',
    status: 'available',
    features: [
      'REST API access',
      'Webhook support',
      'Custom integrations',
      'Real-time data sync',
      'Developer documentation',
    ],
  },
];

export default function IntegrationCards() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'available':
        return 'Available';
      case 'coming-soon':
        return 'Coming Soon';
      default:
        return 'Unknown';
    }
  };

  return (
    <section id="integrations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Integrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect your favorite tools and platforms to create a seamless retention experience for your community.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedIntegration?.name === integration.name
                  ? 'ring-2 ring-primary-500 border-primary-500'
                  : ''
              }`}
              onClick={() => setSelectedIntegration(integration)}
            >
              {/* Integration Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-bold text-sm">{integration.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {integration.name}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    integration.status
                  )}`}
                >
                  {getStatusText(integration.status)}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {integration.description}
              </p>

              {/* Features Preview */}
              <div className="space-y-2">
                {integration.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </div>
                ))}
                {integration.features.length > 3 && (
                  <div className="text-sm text-gray-400">
                    +{integration.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {integration.status === 'available' && (
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Connect Now
                  </button>
                )}
                {integration.status === 'coming-soon' && (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
                {integration.status === 'connected' && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Manage Connection
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Details Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-bold text-lg">{selectedIntegration.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedIntegration.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedIntegration.status
                        )}`}
                      >
                        {getStatusText(selectedIntegration.status)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedIntegration.description}
                </p>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Features Included
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedIntegration.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {selectedIntegration.status === 'available' && (
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Connect {selectedIntegration.name}
                    </button>
                  )}
                  {selectedIntegration.status === 'coming-soon' && (
                    <button
                      disabled
                      className="flex-1 bg-gray-200 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                  {selectedIntegration.status === 'connected' && (
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Manage Connection
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Don&apos;t see your platform? We&apos;re always adding new integrations.
          </p>
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Request Integration
          </button>
        </div>
      </div>
    </section>
  );
}
