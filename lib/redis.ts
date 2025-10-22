import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    
    if (!redisUrl) {
      throw new Error('Redis URL not configured. Please set REDIS_URL or UPSTASH_REDIS_REST_URL');
    }

    redisClient = new Redis(redisUrl, {
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    redisClient.on('error', () => {
      // console.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      // console.log('Redis connected successfully');
    });
  }

  return redisClient;
}

export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
