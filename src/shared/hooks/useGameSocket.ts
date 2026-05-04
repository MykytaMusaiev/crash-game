"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/shared/api/socketService";
import { useGameStore } from "@/store/gameStore";
import { SOCKET_EVENTS } from "@/shared/constants/socketEvents";
import type {
    RoundStatePayload,
    RoundWaitingPayload,
    RoundStartPayload,
    RoundTickPayload,
    RoundCrashPayload,
    BetPlacedPayload,
    BetCashedOutPayload,
    BetLostPayload,
    BetRejectedPayload,
} from "@/shared/types/socketTypes";
import type { RecentRound } from "@/shared/types/playerTypes";

export function useGameSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        socketService.on<RoundStatePayload>(SOCKET_EVENTS.ROUND_STATE, (e) => {
            const store = useGameStore.getState();
            store.setPhase(e.phase);
            store.setRoundId(e.roundId);
            store.setMultiplier(e.currentMultiplier);
            store.setStartedAt(e.startedAt ? new Date(e.startedAt) : null);
            store.setEndsAt(e.endsAt ? new Date(e.endsAt) : null);
            store.setCrashPoint(e.crashPoint);
            store.setMyBet(e.yourBet);
            store.setPlayerCount(e.playerCount);
        });

        socketService.on<RoundWaitingPayload>(
            SOCKET_EVENTS.ROUND_WAITING,
            (e) => {
                const store = useGameStore.getState();
                store.setPhase("waiting");
                store.setRoundId(e.roundId);
                store.setEndsAt(new Date(e.endsAt));
                store.setStartedAt(null);
                store.setMultiplier(1.0);
                store.setCrashPoint(null);
                store.setMyBet(null);
                store.setPlayerCount(0);
            },
        );

        socketService.on<RoundStartPayload>(SOCKET_EVENTS.ROUND_START, (e) => {
            const store = useGameStore.getState();
            store.setPhase("running");
            store.setRoundId(e.roundId);
            store.setStartedAt(new Date(e.startedAt));
            store.setEndsAt(null);
            store.setMultiplier(1.0);
            store.setPlayerCount(e.playerCount);
        });

        socketService.on<RoundTickPayload>(SOCKET_EVENTS.ROUND_TICK, (e) => {
            const store = useGameStore.getState();
            if (e.roundId !== store.roundId) return;
            store.setMultiplier(e.multiplier);
        });

        socketService.on<RoundCrashPayload>(SOCKET_EVENTS.ROUND_CRASH, (e) => {
            const store = useGameStore.getState();
            store.setPhase("crashed");
            store.setMultiplier(e.crashPoint);
            store.setCrashPoint(e.crashPoint);
            store.setCrashFlash(true);
            setTimeout(
                () => useGameStore.getState().setCrashFlash(false),
                1500,
            );

            queryClient.setQueryData<RecentRound[]>(
                ["rounds", "recent"],
                (prev) => {
                    const newRound: RecentRound = {
                        roundId: e.roundId,
                        crashPoint: e.crashPoint,
                        startedAt: new Date().toISOString(),
                    };
                    return [newRound, ...(prev ?? [])];
                },
            );
        });

        socketService.on<BetPlacedPayload>(SOCKET_EVENTS.BET_PLACED, (e) => {
            const store = useGameStore.getState();
            store.setMyBet({
                betId: e.betId,
                amount: e.amount,
                autoCashOutAt: e.autoCashOutAt,
                status: "placed",
            });
            store.setBalance(e.balance);
            store.setActionInFlight(false);
        });

        socketService.on<BetCashedOutPayload>(
            SOCKET_EVENTS.BET_CASHED_OUT,
            (e) => {
                const store = useGameStore.getState();
                store.setBalance(e.balance);
                store.setMyBet(null);
                store.setActionInFlight(false);
                void queryClient.invalidateQueries({ queryKey: ["history"] });
            },
        );

        socketService.on<BetLostPayload>(SOCKET_EVENTS.BET_LOST, (e) => {
            const store = useGameStore.getState();
            store.setBalance(e.balance);
            store.setMyBet(null);
            store.setActionInFlight(false);
            void queryClient.invalidateQueries({ queryKey: ["history"] });
        });

        socketService.on<BetRejectedPayload>(
            SOCKET_EVENTS.BET_REJECTED,
            (e) => {
                useGameStore.getState().setActionInFlight(false);
                console.warn("Bet rejected:", e.reason, e.message);
            },
        );

        return () => {
            socketService.off(SOCKET_EVENTS.ROUND_STATE);
            socketService.off(SOCKET_EVENTS.ROUND_WAITING);
            socketService.off(SOCKET_EVENTS.ROUND_START);
            socketService.off(SOCKET_EVENTS.ROUND_TICK);
            socketService.off(SOCKET_EVENTS.ROUND_CRASH);
            socketService.off(SOCKET_EVENTS.BET_PLACED);
            socketService.off(SOCKET_EVENTS.BET_CASHED_OUT);
            socketService.off(SOCKET_EVENTS.BET_LOST);
            socketService.off(SOCKET_EVENTS.BET_REJECTED);
        };
    }, [queryClient]);
}
