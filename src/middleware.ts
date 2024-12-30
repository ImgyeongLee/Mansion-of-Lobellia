import { NextRequest, NextResponse } from 'next/server';
import { authenticatedUser } from './lib/utils';

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const user = await authenticatedUser({ request, response });

    const isUserPage = request.nextUrl.pathname.startsWith('/dashboard');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isBattlePage = request.nextUrl.pathname.startsWith('/battle');

    if (request.nextUrl.pathname === '/') {
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return response;
    }

    if (isBattlePage) {
        if (!user) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return response;
    }

    if (isAdminPage) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url));
        } else if (!user.isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return response;
    }

    if (isUserPage) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return response;
    } else if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|webp|svg)).*)'],
};
