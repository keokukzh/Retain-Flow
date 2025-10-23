import prisma from '@/lib/prisma';

export interface UnlockLock {
  address: string;
  name: string;
  symbol: string;
  network: string;
  price: string;
  currency: string;
  duration: number;
  maxNumberOfKeys?: number;
  unlimitedKeys: boolean;
  owner: string;
}

export interface UnlockKey {
  id: string;
  lock: string;
  owner: string;
  expiration: number;
  tokenURI?: string;
}

export interface UnlockMembership {
  hasValidKey: boolean;
  keyId?: string;
  expiration?: Date;
  lockAddress: string;
  network: string;
}

export interface UnlockVerificationResult {
  hasMembership: boolean;
  membership?: UnlockMembership;
  error?: string;
}

export class UnlockService {
  private static readonly NETWORK = process.env.UNLOCK_NETWORK || 'polygon';
  private static readonly PROVIDER_URL = process.env.UNLOCK_PROVIDER_URL || 'https://rpc.unlock-protocol.com';

  /**
   * Check if user has active membership
   */
  static async hasActiveMembership(
    userAddress: string,
    lockAddress: string
  ): Promise<UnlockVerificationResult> {
    try {
      // First check database cache
      const cachedMembership = await this.getCachedMembership(userAddress, lockAddress);
      if (cachedMembership && this.isMembershipValid(cachedMembership)) {
        return {
          hasMembership: true,
          membership: cachedMembership,
        };
      }

      // Check on-chain
      const onChainResult = await this.checkOnChainMembership(userAddress, lockAddress);
      
      if (onChainResult.hasMembership && onChainResult.membership) {
        // Cache the result
        await this.cacheMembership(userAddress, onChainResult.membership);
      }

      return onChainResult;
    } catch (error) {
      console.error('Error checking Unlock membership:', error);
      return {
        hasMembership: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify key ownership for a specific lock
   */
  static async verifyKeyOwnership(
    lockAddress: string,
    userAddress: string
  ): Promise<boolean> {
    try {
      const result = await this.hasActiveMembership(userAddress, lockAddress);
      return result.hasMembership;
    } catch (error) {
      console.error('Error verifying key ownership:', error);
      return false;
    }
  }

  /**
   * Get available locks for a network
   */
  static async getAvailableLocks(network?: string): Promise<UnlockLock[]> {
    try {
      const targetNetwork = network || this.NETWORK;
      
      // This would typically call the Unlock Protocol subgraph
      // For now, return a mock implementation
      const response = await this.retryRequest(async () => {
        return await fetch(`https://api.unlock-protocol.com/v2/locks?network=${targetNetwork}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });

      if (!response.ok) {
        throw new Error(`Unlock API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.locks || [];
    } catch (error) {
      console.error('Error getting Unlock locks:', error);
      return [];
    }
  }

  /**
   * Create a new lock (requires admin privileges)
   */
  static async createLock(lockData: {
    name: string;
    symbol: string;
    price: string;
    currency: string;
    duration: number;
    maxNumberOfKeys?: number;
  }): Promise<UnlockLock | null> {
    try {
      // This would typically involve smart contract interaction
      // For now, return a mock implementation
      console.log('Creating Unlock lock:', lockData);
      
      const mockLock: UnlockLock = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        name: lockData.name,
        symbol: lockData.symbol,
        network: this.NETWORK,
        price: lockData.price,
        currency: lockData.currency,
        duration: lockData.duration,
        maxNumberOfKeys: lockData.maxNumberOfKeys,
        unlimitedKeys: !lockData.maxNumberOfKeys,
        owner: '0x0000000000000000000000000000000000000000', // Would be actual owner
      };

      return mockLock;
    } catch (error) {
      console.error('Error creating Unlock lock:', error);
      return null;
    }
  }

  /**
   * Get user's memberships from database
   */
  static async getUserMemberships(userId: string): Promise<UnlockMembership[]> {
    try {
      const memberships = await prisma.unlockMembership.findMany({
        where: { userId },
      });

      return memberships.map((membership: any) => ({
        hasValidKey: this.isMembershipValid(membership),
        keyId: membership.keyId,
        expiration: membership.expiresAt || undefined,
        lockAddress: membership.lockAddress,
        network: this.NETWORK,
      }));
    } catch (error) {
      console.error('Error getting user memberships:', error);
      return [];
    }
  }

  /**
   * Sync user's on-chain memberships to database
   */
  static async syncUserMemberships(userAddress: string, userId: string): Promise<void> {
    try {
      // Get all available locks
      const locks = await this.getAvailableLocks();
      
      for (const lock of locks) {
        const membership = await this.hasActiveMembership(userAddress, lock.address);
        
        if (membership.hasMembership && membership.membership) {
          await this.saveMembership(userId, membership.membership);
        }
      }
    } catch (error) {
      console.error('Error syncing user memberships:', error);
    }
  }

  /**
   * Check on-chain membership status
   */
  private static async checkOnChainMembership(
    userAddress: string,
    lockAddress: string
  ): Promise<UnlockVerificationResult> {
    try {
      // This would typically involve smart contract calls
      // For now, return a mock implementation
      const mockResult = {
        hasValidKey: Math.random() > 0.5, // Random for demo
        keyId: `key_${Math.random().toString(16).substr(2, 8)}`,
        expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      if (mockResult.hasValidKey) {
        return {
          hasMembership: true,
          membership: {
            hasValidKey: true,
            keyId: mockResult.keyId,
            expiration: mockResult.expiration,
            lockAddress,
            network: this.NETWORK,
          },
        };
      }

      return { hasMembership: false };
    } catch (error) {
      console.error('Error checking on-chain membership:', error);
      return {
        hasMembership: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get cached membership from database
   */
  private static async getCachedMembership(
    userAddress: string,
    lockAddress: string
  ): Promise<UnlockMembership | null> {
    try {
      const membership = await prisma.unlockMembership.findFirst({
        where: {
          walletAddress: userAddress,
          lockAddress,
        },
      });

      if (!membership) return null;

      return {
        hasValidKey: this.isMembershipValid(membership),
        keyId: membership.keyId,
        expiration: membership.expiresAt || undefined,
        lockAddress: membership.lockAddress,
        network: this.NETWORK,
      };
    } catch (error) {
      console.error('Error getting cached membership:', error);
      return null;
    }
  }

  /**
   * Cache membership in database
   */
  private static async cacheMembership(
    userAddress: string,
    membership: UnlockMembership
  ): Promise<void> {
    try {
      // Find user by wallet address (this would need to be implemented)
      const user = await prisma.user.findFirst({
        where: {
          // This would need a walletAddress field in the User model
          // For now, we'll use a placeholder
        },
      });

      if (!user) return;

      await prisma.unlockMembership.upsert({
        where: {
          userId_lockAddress: {
            userId: user.id,
            lockAddress: membership.lockAddress,
          },
        },
        update: {
          keyId: membership.keyId,
          expiresAt: membership.expiration,
          walletAddress: userAddress,
        },
        create: {
          userId: user.id,
          lockAddress: membership.lockAddress,
          keyId: membership.keyId || '',
          walletAddress: userAddress,
          expiresAt: membership.expiration,
        },
      });
    } catch (error) {
      console.error('Error caching membership:', error);
    }
  }

  /**
   * Save membership to database
   */
  private static async saveMembership(
    userId: string,
    membership: UnlockMembership
  ): Promise<void> {
    try {
      await prisma.unlockMembership.upsert({
        where: {
          userId_lockAddress: {
            userId,
            lockAddress: membership.lockAddress,
          },
        },
        update: {
          keyId: membership.keyId,
          expiresAt: membership.expiration,
        },
        create: {
          userId,
          lockAddress: membership.lockAddress,
          keyId: membership.keyId || '',
          walletAddress: '', // Would be set from user data
          expiresAt: membership.expiration,
        },
      });
    } catch (error) {
      console.error('Error saving membership:', error);
    }
  }

  /**
   * Check if membership is still valid
   */
  private static isMembershipValid(membership: any): boolean {
    if (!membership.expiresAt) return true; // No expiration means permanent
    return new Date(membership.expiresAt) > new Date();
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
