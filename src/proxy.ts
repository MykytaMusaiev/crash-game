import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "@/shared/constants/cookieConstants";
import {
    GAME_INSTANCE_SEARCH_PARAM,
    getGameInstanceApiKeyCookieName,
    isValidGameInstanceId,
} from "@/shared/lib/gameInstance";

const ROUTES = {
    HOME: "/",
    GAME: "/game",
} as const;

function redirectToHome(request: NextRequest): NextResponse {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.HOME;
    url.search = "";

    return NextResponse.redirect(url);
}

function redirectToGame(
    request: NextRequest,
    instanceId: string,
): NextResponse {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.GAME;
    url.search = "";
    url.searchParams.set(GAME_INSTANCE_SEARCH_PARAM, instanceId);

    return NextResponse.redirect(url);
}

export function proxy(request: NextRequest): NextResponse {
    const { pathname, searchParams } = request.nextUrl;

    const isHomePage = pathname === ROUTES.HOME;
    const isGamePage =
        pathname === ROUTES.GAME || pathname.startsWith(`${ROUTES.GAME}/`);

    if (isHomePage) {
        const rememberedInstanceId =
            request.cookies.get(COOKIE_KEYS.REMEMBERED_INSTANCE_ID)?.value ??
            null;

        if (!isValidGameInstanceId(rememberedInstanceId)) {
            return NextResponse.next();
        }

        const apiKeyCookieName =
            getGameInstanceApiKeyCookieName(rememberedInstanceId);
        const apiKey = request.cookies.get(apiKeyCookieName)?.value;

        if (!apiKey) {
            return NextResponse.next();
        }

        return redirectToGame(request, rememberedInstanceId);
    }

    if (!isGamePage) {
        return NextResponse.next();
    }

    const instanceId = searchParams.get(GAME_INSTANCE_SEARCH_PARAM);

    if (!isValidGameInstanceId(instanceId)) {
        return redirectToHome(request);
    }

    const apiKeyCookieName = getGameInstanceApiKeyCookieName(instanceId);
    const apiKey = request.cookies.get(apiKeyCookieName)?.value;

    if (!apiKey) {
        return redirectToHome(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/game", "/game/:path*"],
};
