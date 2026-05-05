import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import type {
    RecentRound,
    RecentRoundsResponse,
} from "@/shared/types/playerTypes";
import { APP_CONSTANTS } from "../constants/appConstants";

export function useRecentRounds() {
    return useQuery<RecentRoundsResponse, Error, RecentRound[]>({
        queryKey: ["rounds", "recent"],
        queryFn: () =>
            httpClient.get<RecentRoundsResponse>(
                `/api/rounds/recent?limit=${APP_CONSTANTS.RECENT_ROUNDS_LIMIT}`,
            ),
        select: (data) => data.rounds,
        staleTime: Infinity,
    });
}
