import {
    COOKIE_KEYS,
    REMEMBER_COOKIE_MAX_AGE,
} from "@/shared/constants/cookieConstants";

const parseCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
};

export const storage = {
    // Read API key from cookie (works after refresh for both session and persistent)
    getApiKey: (): string | null => {
        return parseCookie(COOKIE_KEYS.API_KEY);
    },

    // persistent: true  → Max-Age 30 days (Remember me)
    // persistent: false → session cookie (cleared when browser closes)
    setApiKey: (apiKey: string, persistent: boolean): void => {
        if (typeof document === "undefined") return;
        const maxAge = persistent ? `; Max-Age=${REMEMBER_COOKIE_MAX_AGE}` : "";
        document.cookie = `${COOKIE_KEYS.API_KEY}=${encodeURIComponent(apiKey)}${maxAge}; Path=/; SameSite=Strict`;
    },

    removeApiKey: (): void => {
        if (typeof document === "undefined") return;
        document.cookie = `${COOKIE_KEYS.API_KEY}=; Max-Age=0; Path=/; SameSite=Strict`;
    },
};
