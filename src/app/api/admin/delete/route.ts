import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function DELETE(req: Request) {
    try {
        if (!redis) {
            return NextResponse.json({ error: 'Redis connection failed' }, { status: 500 });
        }

        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Delete the client key
        await redis.del(`client:${slug}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Failed to delete client:', error);
        return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
}
