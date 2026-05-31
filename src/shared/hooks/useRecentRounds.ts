"use client";

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { APP_CONSTANTS } from "@/shared/constants/appConstants";
import { getCurrentGameInstanceAuth } from "@/shared/lib/currentGameInstanceAuth";
import type {
    RecentRound,
    RecentRoundsResponse,
} from "@/shared/types/playerTypes";

export function useRecentRounds() {
    return useQuery<RecentRoundsResponse, Error, RecentRound[]>({
        queryKey: ["rounds", "recent"],
        queryFn: () => {
            const { apiKey } = getCurrentGameInstanceAuth();

            return httpClient.get<RecentRoundsResponse>(
                `/api/rounds/recent?limit=${APP_CONSTANTS.RECENT_ROUNDS_LIMIT}`,
                { apiKey },
            );
        },
        select: (data) => data.rounds,
        staleTime: Infinity,
    });
}
