"use client";

import { useEffect } from "react";
import { socketService } from "@/shared/api/socketService";
import { storage } from "@/shared/lib/storage";
import { useGameStore } from "@/store/gameStore";
import {
    GAME_INSTANCE_SEARCH_PARAM,
    isValidGameInstanceId,
} from "@/shared/lib/gameInstance";

export function useInitApp() {
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const instanceId = searchParams.get(GAME_INSTANCE_SEARCH_PARAM);

        if (!isValidGameInstanceId(instanceId)) return;

        const apiKey = storage.getInstanceApiKey(instanceId);
        if (!apiKey) return;

        socketService.connect(apiKey);
        useGameStore.getState().setUsername(apiKey);
    }, []);
}
