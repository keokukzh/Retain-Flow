export interface WhopUser {
  id: string;
  email: string;
  username: string;
  membership_status: 'active' | 'inactive' | 'cancelled';
  membership_tier: string;
  created_at: string;
  last_active: string;
}

export interface WhopMembership {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'cancelled';
  tier: string;
  started_at: string;
  expires_at?: string;
}

export class WhopService {
  private apiKey: string;
  private baseUrl = 'https://api.whop.com/v1';

  constructor() {
    this.apiKey = process.env.WHOP_API_KEY || '';
  }

  async getWhopUser(whopId: string): Promise<WhopUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${whopId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Whop API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        username: data.username,
        membership_status: data.membership_status,
        membership_tier: data.membership_tier,
        created_at: data.created_at,
        last_active: data.last_active,
      };
    } catch (error) {
      console.error('Error fetching Whop user:', error);
      return null;
    }
  }

  async syncMembership(whopId: string, userId: string): Promise<WhopMembership | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memberships`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whop_user_id: whopId,
          retainflow_user_id: userId,
        }),
      });

      if (!response.ok) {
        console.error('Whop membership sync error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        user_id: data.user_id,
        status: data.status,
        tier: data.tier,
        started_at: data.started_at,
        expires_at: data.expires_at,
      };
    } catch (error) {
      console.error('Error syncing Whop membership:', error);
      return null;
    }
  }

  async getMembershipStatus(whopId: string): Promise<WhopMembership | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memberships/${whopId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Whop membership status error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        user_id: data.user_id,
        status: data.status,
        tier: data.tier,
        started_at: data.started_at,
        expires_at: data.expires_at,
      };
    } catch (error) {
      console.error('Error fetching Whop membership status:', error);
      return null;
    }
  }

  async syncUserFromWhop(whopId: string): Promise<{ success: boolean; userId?: string }> {
    try {
      const whopUser = await this.getWhopUser(whopId);
      if (!whopUser) {
        return { success: false };
      }

      // This would typically involve creating or updating a user in your database
      // For now, we'll return a mock success response
      return {
        success: true,
        userId: `user_${whopId}`,
      };
    } catch (error) {
      console.error('Error syncing user from Whop:', error);
      return { success: false };
    }
  }

  async handleWebhookEvent(event: any): Promise<boolean> {
    try {
      const { type, data } = event;

      switch (type) {
        case 'membership.created':
          await this.handleMembershipCreated(data);
          break;
        case 'membership.updated':
          await this.handleMembershipUpdated(data);
          break;
        case 'payment.succeeded':
          await this.handlePaymentSucceeded(data);
          break;
        case 'membership.cancelled':
          await this.handleMembershipCancelled(data);
          break;
        default:
          console.log('Unhandled Whop webhook event:', type);
      }

      return true;
    } catch (error) {
      console.error('Error handling Whop webhook event:', error);
      return false;
    }
  }

  private async handleMembershipCreated(data: any): Promise<void> {
    console.log('Whop membership created:', data);
    // Implement membership creation logic
  }

  private async handleMembershipUpdated(data: any): Promise<void> {
    console.log('Whop membership updated:', data);
    // Implement membership update logic
  }

  private async handlePaymentSucceeded(data: any): Promise<void> {
    console.log('Whop payment succeeded:', data);
    // Implement payment success logic
  }

  private async handleMembershipCancelled(data: any): Promise<void> {
    console.log('Whop membership cancelled:', data);
    // Implement membership cancellation logic
  }
}

export const whopService = new WhopService();
