import prisma from '@/lib/prisma';

export interface ChatwootContact {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  customAttributes?: Record<string, any>;
}

export interface ChatwootConversation {
  id: number;
  contactId: number;
  status: 'open' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: ChatwootMessage[];
}

export interface ChatwootMessage {
  id: number;
  content: string;
  messageType: 'incoming' | 'outgoing';
  sender: {
    id: number;
    name: string;
    type: 'contact' | 'agent' | 'bot';
  };
  createdAt: string;
}

export interface ChatwootWebhookPayload {
  event: string;
  data: {
    conversation?: ChatwootConversation;
    contact?: ChatwootContact;
    message?: ChatwootMessage;
  };
}

export class ChatwootService {
  private static readonly API_URL = process.env.CHATWOOT_API_URL || 'https://app.chatwoot.com';
  private static readonly API_TOKEN = process.env.CHATWOOT_API_TOKEN;
  private static readonly WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

  /**
   * Create a new conversation
   */
  static async createConversation(
    userId: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<ChatwootConversation | null> {
    try {
      if (!this.API_TOKEN) {
        console.warn('Chatwoot API token not configured');
        return null;
      }

      // Get or create contact
      const contact = await this.getOrCreateContact(userId);
      if (!contact) {
        throw new Error('Failed to create or get contact');
      }

      // Create conversation
      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/accounts/1/conversations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_id: contact.id,
            inbox_id: 1, // Default inbox ID
            contact_id: contact.id,
            additional_attributes: {
              priority,
              user_id: userId,
            },
          }),
        });
      });

      if (!response.ok) {
        throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
      }

      const conversation = await response.json();

      // Send initial message
      if (message) {
        await this.sendMessage(conversation.id, message, 'outgoing');
      }

      return conversation;
    } catch (error) {
      console.error('Error creating Chatwoot conversation:', error);
      return null;
    }
  }

  /**
   * Send a message to a conversation
   */
  static async sendMessage(
    conversationId: number,
    message: string,
    messageType: 'incoming' | 'outgoing' = 'outgoing'
  ): Promise<boolean> {
    try {
      if (!this.API_TOKEN) {
        console.warn('Chatwoot API token not configured');
        return false;
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/accounts/1/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message,
            message_type: messageType,
          }),
        });
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending Chatwoot message:', error);
      return false;
    }
  }

  /**
   * Sync user data to Chatwoot contact
   */
  static async syncUser(userId: string, userData: {
    email: string;
    name?: string;
    customAttributes?: Record<string, any>;
  }): Promise<ChatwootContact | null> {
    try {
      if (!this.API_TOKEN) {
        console.warn('Chatwoot API token not configured');
        return null;
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create contact
      const contact = await this.getOrCreateContact(userId);
      if (!contact) {
        throw new Error('Failed to create or get contact');
      }

      // Update contact with user data
      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/accounts/1/contacts/${contact.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userData.name || user.name || 'Unknown',
            email: userData.email || user.email,
            custom_attributes: {
              user_id: userId,
              plan: user.subscriptions[0]?.plan || 'free',
              created_at: user.createdAt.toISOString(),
              ...userData.customAttributes,
            },
          }),
        });
      });

      if (!response.ok) {
        throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
      }

      const updatedContact = await response.json();
      return updatedContact;
    } catch (error) {
      console.error('Error syncing user to Chatwoot:', error);
      return null;
    }
  }

  /**
   * Handle incoming webhook from Chatwoot
   */
  static async handleWebhook(payload: ChatwootWebhookPayload): Promise<boolean> {
    try {
      const { event, data } = payload;

      switch (event) {
        case 'conversation.created':
          await this.handleConversationCreated(data.conversation);
          break;
        case 'conversation.updated':
          await this.handleConversationUpdated(data.conversation);
          break;
        case 'message.created':
          await this.handleMessageCreated(data.message);
          break;
        case 'contact.created':
          await this.handleContactCreated(data.contact);
          break;
        default:
          console.log(`Unhandled Chatwoot webhook event: ${event}`);
      }

      return true;
    } catch (error) {
      console.error('Error handling Chatwoot webhook:', error);
      return false;
    }
  }

  /**
   * Get or create contact for user
   */
  private static async getOrCreateContact(userId: string): Promise<ChatwootContact | null> {
    try {
      // First, try to find existing contact by custom attribute
      const searchResponse = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/accounts/1/contacts/search?q=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
          },
        });
      });

      if (searchResponse.ok) {
        const searchResult = await searchResponse.json();
        if (searchResult.payload && searchResult.payload.length > 0) {
          return searchResult.payload[0];
        }
      }

      // If not found, create new contact
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const createResponse = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/v1/accounts/1/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name || 'Unknown',
            email: user.email,
            custom_attributes: {
              user_id: userId,
            },
          }),
        });
      });

      if (!createResponse.ok) {
        throw new Error(`Chatwoot API error: ${createResponse.status} ${createResponse.statusText}`);
      }

      const contact = await createResponse.json();
      return contact;
    } catch (error) {
      console.error('Error getting or creating Chatwoot contact:', error);
      return null;
    }
  }

  /**
   * Handle conversation created webhook
   */
  private static async handleConversationCreated(conversation: ChatwootConversation): Promise<void> {
    console.log('New Chatwoot conversation created:', conversation.id);
    // Add any custom logic for new conversations
  }

  /**
   * Handle conversation updated webhook
   */
  private static async handleConversationUpdated(conversation: ChatwootConversation): Promise<void> {
    console.log('Chatwoot conversation updated:', conversation.id);
    // Add any custom logic for conversation updates
  }

  /**
   * Handle message created webhook
   */
  private static async handleMessageCreated(message: ChatwootMessage): Promise<void> {
    console.log('New Chatwoot message created:', message.id);
    // Add any custom logic for new messages
  }

  /**
   * Handle contact created webhook
   */
  private static async handleContactCreated(contact: ChatwootContact): Promise<void> {
    console.log('New Chatwoot contact created:', contact.id);
    // Add any custom logic for new contacts
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
