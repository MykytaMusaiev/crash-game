"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { useGameStore } from "@/store/gameStore";
import type { BalanceResponse } from "@/shared/types/playerTypes";

interface ClaimBonusResponse {
    claimed: boolean;
    amount: number;
    balance: number;
    claimedAt: string;
    nextClaimAt: string;
    retryAfterMs: number;
    error?: string;
}

export function useClaimBonus() {
    const queryClient = useQueryClient();
    const setBalance = useGameStore((s) => s.setBalance);

    return useMutation({
        mutationFn: () =>
            httpClient.post<ClaimBonusResponse>("/api/bonus/claim", {}),
        onSuccess: (data) => {
            queryClient.setQueryData<BalanceResponse>(["balance"], {
                balance: data.balance,
            });
            setBalance(data.balance);
        },
    });
}
