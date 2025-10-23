import prisma from '@/lib/prisma';

export interface N8nWorkflowData {
  workflowId: string;
  data: Record<string, any>;
  userId?: string;
}

export interface N8nWebhookPayload {
  webhookId: string;
  payload: Record<string, any>;
  headers?: Record<string, string>;
}

export interface N8nWorkflowResponse {
  success: boolean;
  executionId?: string;
  data?: any;
  error?: string;
}

export class N8nService {
  private static readonly API_URL = process.env.N8N_API_URL;
  private static readonly API_KEY = process.env.N8N_API_KEY;

  /**
   * Trigger an n8n workflow
   */
  static async triggerWorkflow(workflowData: N8nWorkflowData): Promise<N8nWorkflowResponse> {
    try {
      if (!this.API_URL || !this.API_KEY) {
        throw new Error('N8N API configuration missing');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/workflows/${workflowData.workflowId}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`,
          },
          body: JSON.stringify({
            data: workflowData.data,
            userId: workflowData.userId,
          }),
        });
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        executionId: result.executionId,
        data: result.data,
      };
    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Handle incoming webhook from n8n
   */
  static async handleWebhook(webhookData: N8nWebhookPayload): Promise<boolean> {
    try {
      // Store webhook data for processing
      await prisma.integration.findFirst({
        where: {
          provider: 'n8n',
          config: {
            path: ['webhookId'],
            equals: webhookData.webhookId,
          },
        },
      });

      // Process webhook based on type
      await this.processWebhookData(webhookData);

      return true;
    } catch (error) {
      console.error('Error handling n8n webhook:', error);
      return false;
    }
  }

  /**
   * Check n8n connection health
   */
  static async checkConnection(): Promise<boolean> {
    try {
      if (!this.API_URL || !this.API_KEY) {
        return false;
      }

      const response = await fetch(`${this.API_URL}/api/v1/workflows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking n8n connection:', error);
      return false;
    }
  }

  /**
   * Get available workflows
   */
  static async getWorkflows(): Promise<any[]> {
    try {
      if (!this.API_URL || !this.API_KEY) {
        throw new Error('N8N API configuration missing');
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/workflows`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
        });
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error getting n8n workflows:', error);
      throw new Error('Failed to get workflows');
    }
  }

  /**
   * Save integration configuration
   */
  static async saveIntegration(userId: string, config: Record<string, any>): Promise<void> {
    try {
      await prisma.integration.upsert({
        where: {
          userId_provider: {
            userId,
            provider: 'n8n',
          },
        },
        update: {
          config,
          updatedAt: new Date(),
        },
        create: {
          userId,
          provider: 'n8n',
          providerKey: this.API_KEY || '',
          config,
        },
      });
    } catch (error) {
      console.error('Error saving n8n integration:', error);
      throw new Error('Failed to save integration');
    }
  }

  /**
   * Get integration configuration
   */
  static async getIntegration(userId: string): Promise<any> {
    try {
      const integration = await prisma.integration.findUnique({
        where: {
          userId_provider: {
            userId,
            provider: 'n8n',
          },
        },
      });

      return integration;
    } catch (error) {
      console.error('Error getting n8n integration:', error);
      throw new Error('Failed to get integration');
    }
  }

  /**
   * Process webhook data based on type
   */
  private static async processWebhookData(webhookData: N8nWebhookPayload): Promise<void> {
    const { webhookId, payload } = webhookData;

    // Process different webhook types
    switch (webhookId) {
      case 'churn-prediction':
        await this.processChurnPredictionWebhook(payload);
        break;
      case 'retention-campaign':
        await this.processRetentionCampaignWebhook(payload);
        break;
      case 'user-signup':
        await this.processUserSignupWebhook(payload);
        break;
      default:
        console.log(`Unknown webhook type: ${webhookId}`);
    }
  }

  /**
   * Process churn prediction webhook
   */
  private static async processChurnPredictionWebhook(payload: any): Promise<void> {
    // Trigger retention campaigns or notifications
    console.log('Processing churn prediction webhook:', payload);
  }

  /**
   * Process retention campaign webhook
   */
  private static async processRetentionCampaignWebhook(payload: any): Promise<void> {
    // Update campaign status or trigger follow-up actions
    console.log('Processing retention campaign webhook:', payload);
  }

  /**
   * Process user signup webhook
   */
  private static async processUserSignupWebhook(payload: any): Promise<void> {
    // Trigger onboarding workflows
    console.log('Processing user signup webhook:', payload);
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
