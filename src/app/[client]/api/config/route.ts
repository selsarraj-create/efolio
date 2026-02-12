import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { getClientConfig } from '@/lib/client-config';

export const dynamic = 'force-dynamic';


export async function GET(req: Request, { params }: { params: Promise<{ client: string }> }) {
    const { client } = await params;

    if (!redis) {
        return NextResponse.json({ error: 'Redis Connection Failed' }, { status: 500 });
    }

    try {
        const config = await getClientConfig(client);

        if (!config) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Client Config Error:", error);
        return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ client: string }> }) {
    const { client } = await params;
    if (!redis) return NextResponse.json({ error: 'Redis not available' }, { status: 500 });

    try {
        const body = await req.json();

        // 1. Save Full Config JSON
        // We exclude _siteId and _storage from storage to prevent corruption
        const configToSave = { ...body };
        delete configToSave._siteId;
        delete configToSave._storage;

        await redis.set(`client:${client}:custom_config`, JSON.stringify(configToSave));

        // 2. Sync critical fields to HASH for indexing/auth
        if (body.password) {
            await redis.hset(`client:${client}`, 'password', body.password);
        }
        if (body.personalInfo?.name) {
            await redis.hset(`client:${client}`, 'name', body.personalInfo.name);
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
