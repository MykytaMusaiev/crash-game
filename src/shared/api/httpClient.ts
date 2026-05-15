import { APP_CONSTANTS } from "@/shared/constants/appConstants";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_KEY_HEADER = "X-API-Key";

interface AuthRequestOptions {
    apiKey: string;
}

interface RequestOptions extends AuthRequestOptions {
    method?: HttpMethod;
    body?: unknown;
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
    const { apiKey, method = "GET", body } = options;

    if (!apiKey) {
        throw new Error("No API key provided");
    }

    const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            [API_KEY_HEADER]: apiKey,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const httpClient = {
    get: <T>(path: string, options: AuthRequestOptions) =>
        request<T>(path, options),

    post: <T>(path: string, body: unknown, options: AuthRequestOptions) =>
        request<T>(path, { ...options, method: "POST", body }),
};
