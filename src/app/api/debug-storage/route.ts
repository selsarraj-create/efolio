import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { put } from '@vercel/blob';

export async function GET() {
    const checks = {
        redis: {
            status: 'unknown',
            message: '',
            env_url_present: !!process.env.REDIS_URL,
            env_url_preview: process.env.REDIS_URL ? (process.env.REDIS_URL.substring(0, 15) + '...') : 'missing'
        },
        blob: {
            status: 'unknown',
            message: '',
            env_token_present: !!process.env.BLOB_READ_WRITE_TOKEN
        }
    };

    // Check Redis
    try {
        if (!redis) {
            checks.redis.status = 'skipped';
            checks.redis.message = 'Redis client not initialized (missing env var?)';
        } else {
            const parsedUrl = new URL(process.env.REDIS_URL || '');
            checks.redis.message = `Connecting to ${parsedUrl.hostname}...`;

            await redis.set('debug-test-key', 'hello-world-' + Date.now());
            const val = await redis.get('debug-test-key');

            if (val && val.startsWith('hello-world')) {
                checks.redis.status = 'success';
                checks.redis.message = 'Write/Read successful';
            } else {
                checks.redis.status = 'failed';
                checks.redis.message = 'Read returned mismatch: ' + val;
            }
        }
    } catch (e: any) {
        checks.redis.status = 'error';
        checks.redis.message = e.message || String(e);
        console.error('Redis Debug Error:', e);
    }

    // Check Blob (Metadata only, don't upload file to save bandwidth/space)
    // We can't easily check blob without uploading, but we can check if token is valid by listing?
    // @vercel/blob doesn't have a simple "ping".
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        checks.blob.status = 'configured';
        checks.blob.message = 'Token present. Check logs for upload failures.';
    } else {
        checks.blob.status = 'missing_token';
    }

    return NextResponse.json(checks, { status: 200 });
}
