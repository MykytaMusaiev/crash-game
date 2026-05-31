"use client";

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { getCurrentGameInstanceAuth } from "@/shared/lib/currentGameInstanceAuth";
import { useGameStore } from "@/store/gameStore";
import type { BalanceResponse } from "@/shared/types/playerTypes";

export function useBalance() {
    const setBalance = useGameStore((s) => s.setBalance);

    // Resolved outside queryFn so it can be included in the query key.
    // With staleTime: Infinity a global key like ["balance"] would serve
    // a cached value from a different game instance when the apiKey changes.
    const { apiKey } = getCurrentGameInstanceAuth();

    return useQuery<BalanceResponse>({
        queryKey: ["balance", apiKey],
        queryFn: async () => {
            const data = await httpClient.get<BalanceResponse>("/api/balance", {
                apiKey,
            });

            setBalance(data.balance);

            return data;
        },
        staleTime: Infinity,
    });
}
