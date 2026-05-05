import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import type {
    RecentRound,
    RecentRoundsResponse,
} from "@/shared/types/playerTypes";

export function useRecentRounds() {
    return useQuery<RecentRoundsResponse, Error, RecentRound[]>({
        queryKey: ["rounds", "recent"],
        queryFn: () =>
            httpClient.get<RecentRoundsResponse>("/api/rounds/recent"),
        select: (data) => data.rounds,
        staleTime: Infinity,
    });
}
