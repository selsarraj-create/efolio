import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { getModelConfig, CONFIG_KEY } from '@/lib/config';

// FALLBACK_CONFIG removed - logic moved to src/lib/config.ts

export const dynamic = 'force-dynamic';

const configPath = path.join(process.cwd(), 'src', 'data', 'model-config.json');

export async function GET() {
    const config = await getModelConfig();
    return NextResponse.json(config);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (process.env.REDIS_URL && redis) {
            // Remove any storage metadata before saving
            const dataToSave = { ...data };
            delete dataToSave._storage;

            await redis.set(CONFIG_KEY, JSON.stringify(dataToSave));
        } else {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('Missing REDIS_URL in Production. Cannot save config.');
            }
            await fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf8');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
