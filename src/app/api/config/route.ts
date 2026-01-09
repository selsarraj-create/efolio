import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const configPath = path.join(process.cwd(), 'src', 'data', 'model-config.json');

export async function GET() {
    try {
        if (process.env.KV_REST_API_URL) {
            const data = await kv.get('model-config');
            if (data) return NextResponse.json(data);
        }

        // Fallback to local file if KV is empty or not configured
        const fileContents = await fs.readFile(configPath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (process.env.KV_REST_API_URL) {
            await kv.set('model-config', data);
        } else {
            await fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf8');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
