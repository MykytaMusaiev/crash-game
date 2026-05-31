import {
    GAME_INSTANCE_SEARCH_PARAM,
    isValidGameInstanceId,
} from "@/shared/lib/gameInstance";
import { storage } from "@/shared/lib/storage";

interface CurrentGameInstanceAuth {
    instanceId: string;
    apiKey: string;
}

export function getCurrentGameInstanceAuth(): CurrentGameInstanceAuth {
    if (typeof window === "undefined") {
        throw new Error(
            "Current game instance auth is only available in the browser",
        );
    }

    const searchParams = new URLSearchParams(window.location.search);
    const instanceId = searchParams.get(GAME_INSTANCE_SEARCH_PARAM);

    if (!isValidGameInstanceId(instanceId)) {
        throw new Error("Invalid game instance id");
    }

    const apiKey = storage.getInstanceApiKey(instanceId);

    if (!apiKey) {
        throw new Error("No API key found for current game instance");
    }

    return {
        instanceId,
        apiKey,
    };
}
