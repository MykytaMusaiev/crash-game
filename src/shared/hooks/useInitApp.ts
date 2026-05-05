"use client";

import { useEffect } from "react";
import { socketService } from "@/shared/api/socketService";
import { storage } from "@/shared/lib/storage";

export function useInitApp() {
    useEffect(() => {
        const apiKey = storage.getApiKey();
        if (!apiKey) return;
        socketService.connect(apiKey);
    }, []);
}
