const STORAGE_KEYS = {
    API_KEY: "crash_api_key",
} as const;

export const storage = {
    getApiKey: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(STORAGE_KEYS.API_KEY);
    },

    setApiKey: (apiKey: string): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    },

    removeApiKey: (): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
    },
};
