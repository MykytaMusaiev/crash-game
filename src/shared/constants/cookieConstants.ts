export const COOKIE_KEYS = {
    API_KEY: "crash_api_key",
    REMEMBERED_INSTANCE_ID: "crash_remembered_instance_id",
} as const;

export const REMEMBER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
