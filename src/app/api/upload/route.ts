import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'profile', 'hero', 'portfolio'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Cloud Storage (Vercel Blob)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const filename = `${type}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const blob = await put(filename, file, {
                access: 'public',
            });
            return NextResponse.json({ url: blob.url });
        }

        // Local Storage
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure upload dir exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filename = `${type}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
