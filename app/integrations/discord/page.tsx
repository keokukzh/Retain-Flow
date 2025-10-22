'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DiscordGuild {
  id: string;
  name: string;
  memberCount: number;
  joinedAt?: string;
  lastActiveAt?: string;
  messageCount: number;
}

interface DiscordStats {
  totalMembers: number;
  activeMembers: number;
  activityRate: number;
}

export default function DiscordIntegrationPage() {
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiscordData();
  }, []);

  const loadDiscordData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/discord/guilds');
      const data = await response.json();
      
      if (data.success) {
        setGuilds(data.guilds);
        setStats({
          totalMembers: data.guilds.reduce((sum: number, guild: DiscordGuild) => sum + guild.memberCount, 0),
          activeMembers: data.guilds.filter((guild: DiscordGuild) => guild.lastActiveAt).length,
          activityRate: 0, // Will be calculated per guild
        });
      } else {
        setError(data.message || 'Failed to load Discord data');
      }
    } catch (error) {
      setError('Failed to load Discord data');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDiscord = () => {
    // In a real app, this would redirect to Discord OAuth
    alert('Discord OAuth integration would be implemented here');
  };

  const handleRunRetentionCampaign = async () => {
    try {
      const response = await fetch('/api/discord/retention-campaign', {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Retention campaign started!');
        await loadDiscordData();
      } else {
        alert('Failed to start retention campaign');
      }
    } catch (error) {
      alert('Error starting retention campaign');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Discord integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discord Integration</h1>
          <p className="mt-2 text-gray-600">Manage your Discord communities and track member engagement</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Connection Status */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Connected Servers</h2>
              </div>
              <div className="p-6">
                {guilds.length > 0 ? (
                  <div className="space-y-4">
                    {guilds.map((guild) => (
                      <div key={guild.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{guild.name}</h3>
                            <p className="text-sm text-gray-600">
                              {guild.memberCount} members
                              {guild.lastActiveAt && (
                                <span className="ml-2 text-green-600">
                                  • Last active: {new Date(guild.lastActiveAt).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              {guild.messageCount} messages
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-4">
                          <Link
                            href={`/integrations/discord/guild/${guild.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => {
                              // Navigate to guild details
                              window.location.href = `/integrations/discord/guild/${guild.id}`;
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Discord Servers Connected</h3>
                    <p className="text-gray-600 mb-4">Connect your Discord account to start tracking member engagement</p>
                    <button
                      onClick={handleConnectDiscord}
                      className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Connect Discord
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Discord Actions */}
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Discord Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={handleRunRetentionCampaign}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Run Retention Campaign
                </button>
                
                <button
                  onClick={loadDiscordData}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Discord Stats */}
            {stats && (
              <div className="mt-6 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Members</span>
                        <span className="font-medium">{stats.totalMembers}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Members</span>
                        <span className="font-medium">{stats.activeMembers}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Activity Rate</span>
                        <span className="font-medium">
                          {stats.totalMembers > 0 
                            ? Math.round((stats.activeMembers / stats.totalMembers) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
