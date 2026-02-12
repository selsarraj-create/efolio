import redis from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { slug, newPassword } = await req.json();
        if (!redis) throw new Error("Redis not connected");

        await redis.hset(`client:${slug}`, 'password', newPassword);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
