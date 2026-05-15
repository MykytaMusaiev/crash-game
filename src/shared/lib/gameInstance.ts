import { COOKIE_KEYS } from "@/shared/constants/cookieConstants";

export const GAME_INSTANCE_SEARCH_PARAM = "instanceId";

const GAME_INSTANCE_ID_MAX_LENGTH = 64;
const GAME_INSTANCE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function createGameInstanceId(): string {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function isValidGameInstanceId(
    instanceId: string | null,
): instanceId is string {
    return Boolean(
        instanceId &&
        instanceId.length <= GAME_INSTANCE_ID_MAX_LENGTH &&
        GAME_INSTANCE_ID_PATTERN.test(instanceId),
    );
}

export function getGameInstanceApiKeyCookieName(instanceId: string): string {
    return `${COOKIE_KEYS.API_KEY}_${instanceId}`;
}

export function createGameUrl(instanceId: string): string {
    return `/game?${GAME_INSTANCE_SEARCH_PARAM}=${encodeURIComponent(instanceId)}`;
}
