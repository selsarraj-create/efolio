import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        console.log("Upload Request initiated. Token present:", !!token);

        if (!token) {
            throw new Error("Missing BLOB_READ_WRITE_TOKEN on server.");
        }

        const jsonResponse = await handleUpload({
            body,
            request,
            token, // Explicitly pass token to avoid auto-lookup issues
            // Allow uploads from the current site (Site B) even though the token is from Site A
            // @ts-expect-error - allowedOrigins is supported by runtime but missing from types
            allowedOrigins: ['*'], // Wildcard to rule out any matching issues
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                console.log("Generating token for:", pathname);
                // You can add authentication/validation here
                // For now, we allow the upload (Admin page is protected by obscurity/auth if added later)
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                    tokenPayload: JSON.stringify({
                        // optional payload to pass to onUploadCompleted
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('Blob upload completed', blob, tokenPayload);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error('HandleUpload Error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // The webhook will retry 5 times if you return 500
        );
    }
}
