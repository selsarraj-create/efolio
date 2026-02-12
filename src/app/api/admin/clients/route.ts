import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface Client {
    slug: string;
    name: string;
    createdAt: string;
}

export async function GET() {
    try {
        if (!redis) {
            return NextResponse.json({ error: 'Redis connection failed' }, { status: 500 });
        }

        // Scan for all client keys
        const keys = await redis.keys('client:*');

        if (keys.length === 0) {
            return NextResponse.json({ clients: [] });
        }

        // Fetch details for all clients (pipeline for performance)
        const pipeline = redis.pipeline();
        keys.forEach(key => {
            pipeline.hgetall(key);
        });

        const results = await pipeline.exec();

        const clients: Client[] = (results?.map((result, index) => {
            const [err, data] = result as [Error | null, any];
            if (err || !data) return null;

            // key is 'client:slug', so extract slug from key or data
            const key = keys[index];
            const slugFromKey = key.replace('client:', '');

            return {
                slug: (data.slug || slugFromKey) as string,
                name: (data.name || 'Unknown') as string,
                createdAt: (data.createdAt || new Date().toISOString()) as string,
            };
        }) || []).filter((item): item is Client => item !== null);

        // Sort by creation date desc
        clients.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return NextResponse.json({ clients });

    } catch (error) {
        console.error('Failed to list clients:', error);
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}
