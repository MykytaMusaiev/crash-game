import {
    COOKIE_KEYS,
    REMEMBER_COOKIE_MAX_AGE,
} from "@/shared/constants/cookieConstants";
import { getGameInstanceApiKeyCookieName } from "@/shared/lib/gameInstance";

const COOKIE_BASE_OPTIONS = "Path=/; SameSite=Strict";

const parseCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));

    if (!match) return null;

    const value = match.slice(name.length + 1);
    return decodeURIComponent(value);
};

const setCookie = (name: string, value: string, persistent: boolean): void => {
    if (typeof document === "undefined") return;

    const maxAge = persistent ? `; Max-Age=${REMEMBER_COOKIE_MAX_AGE}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)}${maxAge}; ${COOKIE_BASE_OPTIONS}`;
};

const removeCookie = (name: string): void => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=; Max-Age=0; ${COOKIE_BASE_OPTIONS}`;
};

export const storage = {
    getInstanceApiKey: (instanceId: string): string | null => {
        return parseCookie(getGameInstanceApiKeyCookieName(instanceId));
    },

    setInstanceApiKey: (
        instanceId: string,
        apiKey: string,
        persistent: boolean,
    ): void => {
        setCookie(
            getGameInstanceApiKeyCookieName(instanceId),
            apiKey,
            persistent,
        );
    },

    removeInstanceApiKey: (instanceId: string): void => {
        removeCookie(getGameInstanceApiKeyCookieName(instanceId));
    },

    getRememberedInstanceId: (): string | null => {
        return parseCookie(COOKIE_KEYS.REMEMBERED_INSTANCE_ID);
    },

    setRememberedInstanceId: (instanceId: string): void => {
        setCookie(COOKIE_KEYS.REMEMBERED_INSTANCE_ID, instanceId, true);
    },

    removeRememberedInstanceId: (): void => {
        removeCookie(COOKIE_KEYS.REMEMBERED_INSTANCE_ID);
    },

    removeLegacyApiKey: (): void => {
        removeCookie(COOKIE_KEYS.API_KEY);
    },
};
