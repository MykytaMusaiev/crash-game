import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_KEYS = {
    API_KEY: "crash_api_key",
} as const;

const ROUTES = {
    HOME: "/",
    GAME: "/game",
} as const;

export function proxy(request: NextRequest): NextResponse {
    const apiKey = request.cookies.get(COOKIE_KEYS.API_KEY)?.value;
    const { pathname } = request.nextUrl;

    const isHomePage = pathname === ROUTES.HOME;
    const isGamePage = pathname.startsWith(ROUTES.GAME);

    if (isHomePage && apiKey) {
        const url = request.nextUrl.clone();
        url.pathname = ROUTES.GAME;
        return NextResponse.redirect(url);
    }

    if (isGamePage && !apiKey) {
        const url = request.nextUrl.clone();
        url.pathname = ROUTES.HOME;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/game/:path*"],
};
