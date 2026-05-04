"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/shared/api/socketService";
import { httpClient } from "@/shared/api/httpClient";
import { storage } from "@/shared/lib/storage";
import { useGameStore } from "@/store/gameStore";
import type { BalanceResponse } from "@/shared/types/playerTypes";

export function useInitApp() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const apiKey = storage.getApiKey();

        // If there is no key, the user is not logged in yet, we do nothing.
        // The login page itself will write the key and connect.
        if (!apiKey) return;

        // Connect the socket with the key.
        // socketService.connect() is idempotent — if already connected, does nothing.
        // This is important for hot reload and StrictMode (double useEffect call).
        socketService.connect(apiKey);

        // Get the initial balance via REST once.
        // Next, the balance is updated exclusively from WS-events (bet:placed, bet:cashedOut, bet:lost).
        // TanStack Query caches the result - calling useInitApp again will not make a new query.
        void queryClient
            .fetchQuery({
                queryKey: ["balance"],
                queryFn: () => httpClient.get<BalanceResponse>("/api/balance"),
                staleTime: Infinity, // do not autorefetch —  the balance lives in WS
            })
            .then((data) => {
                useGameStore.getState().setBalance(data.balance);
            });
    }, [queryClient]);
}
