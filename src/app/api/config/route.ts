import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const configPath = path.join(process.cwd(), 'src', 'data', 'model-config.json');

export async function GET() {
    try {
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
        await fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf8');
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
