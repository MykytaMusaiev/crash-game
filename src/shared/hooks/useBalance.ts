"use client";

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { getCurrentGameInstanceAuth } from "@/shared/lib/currentGameInstanceAuth";
import { useGameStore } from "@/store/gameStore";
import type { BalanceResponse } from "@/shared/types/playerTypes";

export function useBalance() {
    const setBalance = useGameStore((s) => s.setBalance);

    // getCurrentGameInstanceAuth() reads from browser-only storage and throws
    // on the server. Guard with typeof window so this hook renders safely
    // during Next.js static page generation; enabled: false ensures queryFn
    // never fires in that environment, preserving the original SSR behavior.
    const apiKey =
        typeof window !== "undefined"
            ? getCurrentGameInstanceAuth().apiKey
            : null;

    return useQuery<BalanceResponse>({
        // Instance-scoped key: prevents a cached balance from one apiKey being
        // served to a different game instance (staleTime: Infinity makes this
        // especially dangerous without the key).
        queryKey: ["balance", apiKey],
        queryFn: async () => {
            const data = await httpClient.get<BalanceResponse>("/api/balance", {
                // Re-read inside queryFn — always browser-only since enabled
                // is false on the server, so no throw risk here.
                apiKey: getCurrentGameInstanceAuth().apiKey,
            });

            setBalance(data.balance);

            return data;
        },
        enabled: apiKey !== null,
        staleTime: Infinity,
    });
}
