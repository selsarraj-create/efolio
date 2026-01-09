import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

const configPath = path.join(process.cwd(), 'src', 'data', 'model-config.json');

export async function GET() {
    try {
        if (process.env.REDIS_URL && redis) {
            try {
                const rawData = await redis.get('model-config');
                if (rawData) {
                    const data = JSON.parse(rawData);
                    return NextResponse.json({ ...data, _storage: 'kv' });
                }
            } catch (e) {
                console.error("Redis error:", e);
            }
        }

        // Fallback to local file
        const fileContents = await fs.readFile(configPath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json({
            ...data,
            _storage: process.env.REDIS_URL ? 'kv-migrating' : 'fs'
        });
    } catch {
        return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (process.env.KV_REST_API_URL && redis) {
            // Remove any storage metadata before saving
            const dataToSave = { ...data };
            delete dataToSave._storage;

            await redis.set('model-config', JSON.stringify(dataToSave));
        } else {
            await fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf8');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
