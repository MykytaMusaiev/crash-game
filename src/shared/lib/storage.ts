const STORAGE_KEYS = {
    API_KEY: "crash_api_key",
} as const;

export const storage = {
    getApiKey: (): string | null => {
        return localStorage.getItem(STORAGE_KEYS.API_KEY);
    },

    setApiKey: (apiKey: string): void => {
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    },

    removeApiKey: (): void => {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
    },
};
