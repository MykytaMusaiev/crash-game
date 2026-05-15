"use client";

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { getCurrentGameInstanceAuth } from "@/shared/lib/currentGameInstanceAuth";
import { useGameStore } from "@/store/gameStore";
import type { BalanceResponse } from "@/shared/types/playerTypes";

export function useBalance() {
    const setBalance = useGameStore((s) => s.setBalance);

    return useQuery<BalanceResponse>({
        queryKey: ["balance"],
        queryFn: async () => {
            const { apiKey } = getCurrentGameInstanceAuth();

            const data = await httpClient.get<BalanceResponse>("/api/balance", {
                apiKey,
            });

            setBalance(data.balance);

            return data;
        },
        staleTime: Infinity,
    });
}
