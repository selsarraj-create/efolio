import Redis from 'ioredis';

// Singleton pattern for ioredis
// This handles TCP connections to Standard Redis (e.g. Redis Labs, Vercel Generic Redis)

const redisClientSingleton = () => {
    // We favor REDIS_URL which is standard for most providers including Vercel
    const connectionString = process.env.REDIS_URL || process.env.KV_REST_API_URL;

    if (!connectionString) {
        // In local development, return undefined if no keys are present
        return undefined;
    }

    // Check if it's unintentionally trying to use Upstash REST URL with ioredis
    if (connectionString.includes('upstash.io') && connectionString.startsWith('https')) {
        console.warn('WARNING: Attempting to use ioredis with an HTTP URL. This will likely fail. Ensure REDIS_URL is a redis:// TCP URL.');
    }

    // ioredis connects lazily
    const client = new Redis(connectionString, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
    });

    // Silence errors to prevent crashing app on connection failure (handled in API)
    client.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });

    return client;
}

declare global {
    var redis: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redis ?? redisClientSingleton()

export default redis

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis
