'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  CogIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  LinkIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface AvailableIntegration {
  provider: string;
  name: string;
  description: string;
  category: 'automation' | 'analytics' | 'support' | 'payments' | 'communication';
  icon?: string;
  website?: string;
  configured: boolean;
  status: 'available' | 'connected' | 'error';
}

interface IntegrationStatus {
  provider: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'not_configured';
  lastChecked: Date;
  error?: string;
  config?: Record<string, any>;
}

const categoryIcons = {
  automation: WrenchScrewdriverIcon,
  analytics: ChartBarIcon,
  support: ChatBubbleLeftRightIcon,
  payments: CreditCardIcon,
  communication: LinkIcon,
};

const statusColors = {
  connected: 'text-green-600 bg-green-100',
  disconnected: 'text-gray-600 bg-gray-100',
  error: 'text-red-600 bg-red-100',
  not_configured: 'text-yellow-600 bg-yellow-100',
};

const statusIcons = {
  connected: CheckCircleIcon,
  disconnected: XCircleIcon,
  error: ExclamationTriangleIcon,
  not_configured: ExclamationTriangleIcon,
};

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<AvailableIntegration[]>([]);
  const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available integrations
      const integrationsResponse = await fetch(`/api/integrations/available?userId=${user?.id}`);
      const integrationsData = await integrationsResponse.json();

      if (integrationsData.success) {
        setIntegrations(integrationsData.data);
      }

      // Load integration statuses
      const statusesResponse = await fetch(`/api/integrations/status?userId=${user?.id}`);
      const statusesData = await statusesResponse.json();

      if (statusesData.success) {
        setStatuses(statusesData.data);
      }
    } catch (err) {
      setError('Failed to load integrations');
      console.error('Error loading integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          provider,
          config: {},
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadIntegrations(); // Reload to update status
      } else {
        setError(`Failed to connect ${provider}: ${data.error}`);
      }
    } catch (err) {
      setError(`Failed to connect ${provider}`);
      console.error('Error connecting integration:', err);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const response = await fetch('/api/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          provider,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadIntegrations(); // Reload to update status
      } else {
        setError(`Failed to disconnect ${provider}: ${data.error}`);
      }
    } catch (err) {
      setError(`Failed to disconnect ${provider}`);
      console.error('Error disconnecting integration:', err);
    }
  };

  const getIntegrationStatus = (provider: string) => {
    return statuses.find(status => status.provider === provider);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">
            Connect your favorite tools and services to enhance your RetainFlow experience.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const status = getIntegrationStatus(integration.provider);
            const StatusIcon = status ? statusIcons[status.status] : statusIcons.not_configured;
            const CategoryIcon = categoryIcons[integration.category];

            return (
              <div
                key={integration.provider}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {integration.icon ? (
                        <span className="text-2xl">{integration.icon}</span>
                      ) : (
                        <CategoryIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {integration.category}
                      </p>
                    </div>
                  </div>
                  {status && (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status.status]}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.status.replace('_', ' ')}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {integration.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {integration.website && (
                      <a
                        href={integration.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Learn more
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {status?.status === 'connected' ? (
                      <button
                        onClick={() => handleDisconnect(integration.provider)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Disconnect
                      </button>
                    ) : integration.configured ? (
                      <button
                        onClick={() => handleConnect(integration.provider)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Connect
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-400 bg-gray-50">
                        Not Configured
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {status?.error && (
                  <div className="mt-3 text-xs text-red-600">
                    {status.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {integrations.length === 0 && (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No integrations available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check your environment configuration to enable integrations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
