import redis from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        if (!redis) return NextResponse.json({ error: 'Redis not initialized' }, { status: 500 });

        const { fullName } = await req.json();
        const slug = fullName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

        if (!slug) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const exists = await redis.exists(`client:${slug}`);
        if (exists) return NextResponse.json({ error: 'Subdomain taken' }, { status: 400 });

        const clientData = {
            name: fullName,
            slug: slug,
            active: 'true',
            password: 'change-me-123', // Initial temporary password for the model
            createdAt: new Date().toISOString()
        };

        await redis.hmset(`client:${slug}`, clientData);

        return NextResponse.json({
            success: true,
            url: `https://${slug}.edgetalent.co.uk`
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create virtual clone' }, { status: 500 });
    }
}
