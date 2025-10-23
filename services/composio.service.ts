import prisma from '@/lib/prisma';

export interface ComposioApp {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
}

export interface ComposioAction {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface ComposioConnection {
  id: string;
  appId: string;
  appName: string;
  status: 'active' | 'inactive' | 'error';
  connectedAt: Date;
  lastUsedAt?: Date;
}

export interface ComposioExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
}

export class ComposioService {
  private static readonly API_URL = 'https://api.composio.dev';
  private static readonly API_KEY = process.env.COMPOSIO_API_KEY;

  /**
   * Get available apps
   */
  static async getAvailableApps(): Promise<ComposioApp[]> {
    try {
      if (!this.API_KEY) {
        throw new Error('Composio API key not configured');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/v1/apps`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.apps || [];
    } catch (error) {
      console.error('Error getting Composio apps:', error);
      throw new Error('Failed to get available apps');
    }
  }

  /**
   * Connect to an app
   */
  static async connectApp(userId: string, appId: string, config: Record<string, any>): Promise<ComposioConnection> {
    try {
      if (!this.API_KEY) {
        throw new Error('Composio API key not configured');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/v1/connections`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appId,
            userId,
            config,
          }),
        });
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Save connection to database
      await this.saveConnection(userId, appId, result.connectionId, config);

      return {
        id: result.connectionId,
        appId,
        appName: result.appName || appId,
        status: 'active',
        connectedAt: new Date(),
      };
    } catch (error) {
      console.error('Error connecting to Composio app:', error);
      throw new Error('Failed to connect to app');
    }
  }

  /**
   * Execute an action
   */
  static async executeAction(
    userId: string,
    appId: string,
    actionId: string,
    parameters: Record<string, any>
  ): Promise<ComposioExecutionResult> {
    try {
      if (!this.API_KEY) {
        throw new Error('Composio API key not configured');
      }

      // Get connection for user and app
      const connection = await this.getConnection(userId, appId);
      if (!connection) {
        throw new Error('No active connection found for this app');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/v1/actions/execute`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            connectionId: connection.id,
            actionId,
            parameters,
          }),
        });
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Update last used timestamp
      await this.updateConnectionLastUsed(connection.id);

      return {
        success: true,
        data: result.data,
        executionId: result.executionId,
      };
    } catch (error) {
      console.error('Error executing Composio action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * List user connections
   */
  static async listConnections(userId: string): Promise<ComposioConnection[]> {
    try {
      const integrations = await prisma.integration.findMany({
        where: {
          userId,
          provider: 'composio',
        },
      });

      return integrations.map(integration => ({
        id: integration.id,
        appId: (integration.config as any)?.appId || '',
        appName: (integration.config as any)?.appName || '',
        status: integration.active ? 'active' : 'inactive',
        connectedAt: integration.createdAt,
        lastUsedAt: integration.updatedAt,
      }));
    } catch (error) {
      console.error('Error listing Composio connections:', error);
      throw new Error('Failed to list connections');
    }
  }

  /**
   * Disconnect an app
   */
  static async disconnectApp(userId: string, appId: string): Promise<boolean> {
    try {
      const integration = await prisma.integration.findFirst({
        where: {
          userId,
          provider: 'composio',
          config: {
            path: ['appId'],
            equals: appId,
          },
        },
      });

      if (!integration) {
        return false;
      }

      // Deactivate integration
      await prisma.integration.update({
        where: { id: integration.id },
        data: { active: false },
      });

      return true;
    } catch (error) {
      console.error('Error disconnecting Composio app:', error);
      return false;
    }
  }

  /**
   * Get available actions for an app
   */
  static async getAppActions(appId: string): Promise<ComposioAction[]> {
    try {
      if (!this.API_KEY) {
        throw new Error('Composio API key not configured');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/v1/apps/${appId}/actions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.actions || [];
    } catch (error) {
      console.error('Error getting Composio app actions:', error);
      throw new Error('Failed to get app actions');
    }
  }

  /**
   * Save connection to database
   */
  private static async saveConnection(
    userId: string,
    appId: string,
    connectionId: string,
    config: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.integration.upsert({
        where: {
          userId_provider: {
            userId,
            provider: 'composio',
          },
        },
        update: {
          config: {
            appId,
            connectionId,
            ...config,
          },
          updatedAt: new Date(),
        },
        create: {
          userId,
          provider: 'composio',
          providerKey: this.API_KEY || '',
          config: {
            appId,
            connectionId,
            ...config,
          },
        },
      });
    } catch (error) {
      console.error('Error saving Composio connection:', error);
      throw new Error('Failed to save connection');
    }
  }

  /**
   * Get connection for user and app
   */
  private static async getConnection(userId: string, appId: string): Promise<any> {
    try {
      const integration = await prisma.integration.findFirst({
        where: {
          userId,
          provider: 'composio',
          active: true,
          config: {
            path: ['appId'],
            equals: appId,
          },
        },
      });

      return integration;
    } catch (error) {
      console.error('Error getting Composio connection:', error);
      return null;
    }
  }

  /**
   * Update connection last used timestamp
   */
  private static async updateConnectionLastUsed(connectionId: string): Promise<void> {
    try {
      await prisma.integration.updateMany({
        where: {
          provider: 'composio',
          config: {
            path: ['connectionId'],
            equals: connectionId,
          },
        },
        data: {
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating connection last used:', error);
    }
  }

  /**
   * Retry request with exponential backoff
   */
  private static async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  }
}
