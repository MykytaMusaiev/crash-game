import { APP_CONSTANTS } from "@/shared/constants/appConstants";
import { storage } from "@/shared/lib/storage";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
}

async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const apiKey = storage.getApiKey();
    if (!apiKey) throw new Error("No API key found");

    const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const httpClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "POST", body }),
};
