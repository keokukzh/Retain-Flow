import React from 'react';

interface IntegrationCardProps {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  icon: React.ReactNode;
  onConnect?: () => void;
  onDisconnect?: () => void;
  connectedData?: {
    guilds?: number;
    subscriptions?: number;
    [key: string]: any;
  };
}

export default function IntegrationCard({
  name,
  status,
  description,
  icon,
  onConnect,
  onDisconnect,
  connectedData
}: IntegrationCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-500/20';
      case 'disconnected':
        return 'text-gray-400 bg-gray-500/20';
      case 'error':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Not Connected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-primary-400">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
      
      {status === 'connected' && connectedData && (
        <div className="mb-4 space-y-2">
          {connectedData.guilds !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Guilds:</span>
              <span className="text-white font-medium">{connectedData.guilds}</span>
            </div>
          )}
          {connectedData.subscriptions !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subscriptions:</span>
              <span className="text-white font-medium">{connectedData.subscriptions}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-2">
        {status === 'connected' ? (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
