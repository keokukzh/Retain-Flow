import { N8nService } from './n8n.service';
import { ComposioService } from './composio.service';
import { PostHogService } from './posthog.service';
import { ChatwootService } from './chatwoot.service';
import { UnlockService } from './unlock.service';
import prisma from '@/lib/prisma';

export interface IntegrationStatus {
  provider: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'not_configured';
  lastChecked: Date;
  error?: string;
  config?: Record<string, any>;
}

export interface IntegrationHealth {
  provider: string;
  healthy: boolean;
  responseTime?: number;
  lastError?: string;
  checkedAt: Date;
}

export interface AvailableIntegration {
  provider: string;
  name: string;
  description: string;
  category: 'automation' | 'analytics' | 'support' | 'payments' | 'communication';
  icon?: string;
  website?: string;
  configured: boolean;
  status: 'available' | 'connected' | 'error';
}

export class IntegrationManagerService {
  private static readonly INTEGRATIONS = [
    {
      provider: 'n8n',
      name: 'n8n Workflow Automation',
      description: 'Automate workflows and orchestrate complex processes',
      category: 'automation' as const,
      icon: '🔧',
      website: 'https://n8n.io',
    },
    {
      provider: 'composio',
      name: 'Composio API Integration',
      description: 'Connect with 100+ SaaS applications through a single API',
      category: 'automation' as const,
      icon: '🔗',
      website: 'https://composio.dev',
    },
    {
      provider: 'posthog',
      name: 'PostHog Analytics',
      description: 'Product analytics, feature flags, and user insights',
      category: 'analytics' as const,
      icon: '📊',
      website: 'https://posthog.com',
    },
    {
      provider: 'chatwoot',
      name: 'Chatwoot Live Support',
      description: 'Customer engagement platform with live chat and help desk',
      category: 'support' as const,
      icon: '💬',
      website: 'https://chatwoot.com',
    },
    {
      provider: 'unlock',
      name: 'Unlock Protocol',
      description: 'Decentralized membership protocol for Web3-native access',
      category: 'payments' as const,
      icon: '🔐',
      website: 'https://unlock-protocol.com',
    },
  ];

  /**
   * Get all available integrations
   */
  static async getAvailableIntegrations(userId?: string): Promise<AvailableIntegration[]> {
    try {
      const integrations = this.INTEGRATIONS.map(integration => ({
        ...integration,
        configured: this.isIntegrationConfigured(integration.provider),
        status: 'available' as const,
      }));

      // If userId provided, check connection status
      if (userId) {
        for (const integration of integrations) {
          const status = await this.getIntegrationStatus(userId, integration.provider);
          (integration as AvailableIntegration).status = status.status === 'connected' ? 'connected' : 
                              status.status === 'error' ? 'error' : 
                              status.status === 'not_configured' ? 'available' : 'available';
        }
      }

      return integrations;
    } catch (error) {
      console.error('Error getting available integrations:', error);
      return [];
    }
  }

  /**
   * Get status of all user integrations
   */
  static async getAllIntegrationStatuses(userId: string): Promise<IntegrationStatus[]> {
    try {
      const statuses: IntegrationStatus[] = [];

      for (const integration of this.INTEGRATIONS) {
        const status = await this.getIntegrationStatus(userId, integration.provider);
        statuses.push({
          ...status,
          name: integration.name,
          description: integration.description,
        });
      }

      return statuses;
    } catch (error) {
      console.error('Error getting integration statuses:', error);
      return [];
    }
  }

  /**
   * Get status of a specific integration
   */
  static async getIntegrationStatus(userId: string, provider: string): Promise<IntegrationStatus> {
    const integration = this.INTEGRATIONS.find(i => i.provider === provider);
    if (!integration) {
      throw new Error(`Unknown integration: ${provider}`);
    }
    
    try {

      // Check if integration is configured
      if (!this.isIntegrationConfigured(provider)) {
        return {
          provider,
          name: integration.name,
          description: integration.description,
          status: 'not_configured',
          lastChecked: new Date(),
        };
      }

      // Check connection status
      const isConnected = await this.checkIntegrationConnection(provider);
      
      // Get user's integration config
      const userIntegration = await this.getUserIntegration(userId, provider);

      return {
        provider,
        name: integration.name,
        description: integration.description,
        status: isConnected ? 'connected' : 'error',
        lastChecked: new Date(),
        config: userIntegration?.config,
      };
    } catch (error) {
      console.error(`Error getting ${provider} integration status:`, error);
      return {
        provider,
        name: integration?.name || provider,
        description: integration?.description || '',
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Perform health check on all integrations
   */
  static async performHealthChecks(): Promise<IntegrationHealth[]> {
    try {
      const healthChecks: IntegrationHealth[] = [];

      for (const integration of this.INTEGRATIONS) {
        const startTime = Date.now();
        
        try {
          const isHealthy = await this.checkIntegrationConnection(integration.provider);
          const responseTime = Date.now() - startTime;

          healthChecks.push({
            provider: integration.provider,
            healthy: isHealthy,
            responseTime,
            checkedAt: new Date(),
          });
        } catch (error) {
          healthChecks.push({
            provider: integration.provider,
            healthy: false,
            lastError: error instanceof Error ? error.message : 'Unknown error',
            checkedAt: new Date(),
          });
        }
      }

      return healthChecks;
    } catch (error) {
      console.error('Error performing health checks:', error);
      return [];
    }
  }

  /**
   * Connect an integration for a user
   */
  static async connectIntegration(
    userId: string,
    provider: string,
    config: Record<string, any>
  ): Promise<boolean> {
    try {
      // Validate integration exists
      const integration = this.INTEGRATIONS.find(i => i.provider === provider);
      if (!integration) {
        throw new Error(`Unknown integration: ${provider}`);
      }

      // Check if integration is configured
      if (!this.isIntegrationConfigured(provider)) {
        throw new Error(`Integration ${provider} is not configured`);
      }

      // Save integration config
      await prisma.integration.upsert({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
        update: {
          config,
          active: true,
          updatedAt: new Date(),
        },
        create: {
          userId,
          provider,
          providerKey: this.getProviderKey(provider),
          config,
          active: true,
        },
      });

      return true;
    } catch (error) {
      console.error(`Error connecting ${provider} integration:`, error);
      return false;
    }
  }

  /**
   * Disconnect an integration for a user
   */
  static async disconnectIntegration(userId: string, provider: string): Promise<boolean> {
    try {
      await prisma.integration.updateMany({
        where: {
          userId,
          provider,
        },
        data: {
          active: false,
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error(`Error disconnecting ${provider} integration:`, error);
      return false;
    }
  }

  /**
   * Get user's integration configuration
   */
  static async getUserIntegration(userId: string, provider: string): Promise<any> {
    try {
      const integration = await prisma.integration.findUnique({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
      });

      return integration;
    } catch (error) {
      console.error(`Error getting user ${provider} integration:`, error);
      return null;
    }
  }

  /**
   * Check if integration is configured (has required environment variables)
   */
  private static isIntegrationConfigured(provider: string): boolean {
    switch (provider) {
      case 'n8n':
        return !!(process.env.N8N_API_URL && process.env.N8N_API_KEY);
      case 'composio':
        return !!process.env.COMPOSIO_API_KEY;
      case 'posthog':
        return !!(process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST);
      case 'chatwoot':
        return !!(process.env.CHATWOOT_API_URL && process.env.CHATWOOT_API_TOKEN);
      case 'unlock':
        return !!(process.env.UNLOCK_NETWORK && process.env.UNLOCK_PROVIDER_URL);
      default:
        return false;
    }
  }

  /**
   * Check integration connection health
   */
  private static async checkIntegrationConnection(provider: string): Promise<boolean> {
    try {
      switch (provider) {
        case 'n8n':
          return await N8nService.checkConnection();
        case 'composio':
          // Composio doesn't have a direct health check, assume healthy if configured
          return !!process.env.COMPOSIO_API_KEY;
        case 'posthog':
          // PostHog doesn't have a direct health check, assume healthy if configured
          return !!(process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST);
        case 'chatwoot':
          // Chatwoot doesn't have a direct health check, assume healthy if configured
          return !!(process.env.CHATWOOT_API_URL && process.env.CHATWOOT_API_TOKEN);
        case 'unlock':
          // Unlock doesn't have a direct health check, assume healthy if configured
          return !!(process.env.UNLOCK_NETWORK && process.env.UNLOCK_PROVIDER_URL);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error checking ${provider} connection:`, error);
      return false;
    }
  }

  /**
   * Get provider key from environment
   */
  private static getProviderKey(provider: string): string {
    switch (provider) {
      case 'n8n':
        return process.env.N8N_API_KEY || '';
      case 'composio':
        return process.env.COMPOSIO_API_KEY || '';
      case 'posthog':
        return process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
      case 'chatwoot':
        return process.env.CHATWOOT_API_TOKEN || '';
      case 'unlock':
        return process.env.UNLOCK_NETWORK || '';
      default:
        return '';
    }
  }
}
