import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host');
    const path = url.pathname; // This captures '/about', '/gallery', etc.

    const rootDomain = 'edgetalent.co.uk';
    const sub = hostname?.replace(`.${rootDomain}`, '');

    // Skip system files and the main hub
    if (!sub || sub === 'marion' || sub === 'www' || sub === 'mail' || sub === 'sango' || path.startsWith('/_next') || path === '/api/send-email') {
        return NextResponse.next();
    }

    // REWRITE: Append the path so internal pages work
    // This turns 'bob.edgetalent.co.uk/about' into '/bob/about'
    const response = NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));

    // FORCE VERCEL TO BYPASS CACHE FOR THIS REWRITE
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');

    return response;
}
