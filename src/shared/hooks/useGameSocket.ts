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
    PlayersBetPayload,
    PlayersCashoutPayload,
    PlayersLostPayload,
} from "@/shared/types/socketTypes";
import type {
    PublicPlayer,
    RecentRoundsResponse,
} from "@/shared/types/playerTypes";
import type { RecentRound } from "@/shared/types/playerTypes";
import type { RoundTier } from "@/shared/types/gameTypes";
import { audioService } from "../api/audioService";

export function useGameSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const { setConnected } = useGameStore.getState();

        // Connection state
        socketService.on("connect", () => setConnected(true));
        socketService.on("disconnect", () => {
            setConnected(false);
            audioService.play("disconnected"); // ← ADD
        });

        // Sync initial state — socket may already be connected before this hook mounts
        setConnected(socketService.isConnected());

        socketService.on<RoundStatePayload>(SOCKET_EVENTS.ROUND_STATE, (e) => {
            const store = useGameStore.getState();
            store.setPhase(e.phase);
            store.setRoundId(e.roundId);
            store.setMultiplier(e.currentMultiplier);
            store.setStartedAt(e.startedAt ? new Date(e.startedAt) : null);
            store.setEndsAt(e.endsAt ? new Date(e.endsAt) : null);
            store.setCrashPoint(e.crashPoint);
            store.setMyBet(e.yourBet);
            store.setPlayers(e.players);
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
                store.setHadBetThisRound(false);
                store.setMyBet(null);
                store.setPlayers(e.players);
            },
        );

        socketService.on<RoundStartPayload>(SOCKET_EVENTS.ROUND_START, (e) => {
            const store = useGameStore.getState();
            store.setPhase("running");
            store.setRoundId(e.roundId);
            store.setStartedAt(new Date(e.startedAt));
            store.setEndsAt(null);
            store.setMultiplier(1.0);
            store.setPlayers(e.players);
            audioService.play("start");
        });

        socketService.on<RoundTickPayload>(SOCKET_EVENTS.ROUND_TICK, (e) => {
            const store = useGameStore.getState();
            if (e.roundId !== store.roundId) return;
            store.setMultiplier(e.multiplier);
            audioService.play("tick");
        });

        socketService.on<RoundCrashPayload>(SOCKET_EVENTS.ROUND_CRASH, (e) => {
            const store = useGameStore.getState();
            store.setPhase("crashed");
            store.setMultiplier(e.crashPoint);
            store.setCrashPoint(e.crashPoint);
            store.setPlayers(e.players);
            store.setCrashFlash(true);
            audioService.play("crash");
            setTimeout(
                () => useGameStore.getState().setCrashFlash(false),
                1500,
            );

            queryClient.setQueryData<RecentRoundsResponse>(
                ["rounds", "recent"],
                (prev) => {
                    const newRound: RecentRound = {
                        roundId: e.roundId,
                        crashPoint: e.crashPoint,
                        crashedAt: new Date().toISOString(),
                        tier: e.tier as RoundTier,
                    };
                    return {
                        rounds: [newRound, ...(prev?.rounds ?? [])],
                    };
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
            audioService.play("bet_placed");
        });

        socketService.on<BetCashedOutPayload>(
            SOCKET_EVENTS.BET_CASHED_OUT,
            (e) => {
                const store = useGameStore.getState();
                store.setBalance(e.balance);
                store.setHadBetThisRound(true);
                store.setMyBet(null);
                store.setActionInFlight(false);
                audioService.play("cashout");
            },
        );

        socketService.on<BetLostPayload>(SOCKET_EVENTS.BET_LOST, (e) => {
            const store = useGameStore.getState();
            store.setBalance(e.balance);
            store.setHadBetThisRound(true);
            store.setMyBet(null);
            store.setActionInFlight(false);
        });

        socketService.on<BetRejectedPayload>(
            SOCKET_EVENTS.BET_REJECTED,
            (e) => {
                useGameStore.getState().setActionInFlight(false);
                console.warn("Bet rejected:", e.reason, e.message);
            },
        );

        socketService.on<PlayersBetPayload>(SOCKET_EVENTS.PLAYERS_BET, (e) => {
            const store = useGameStore.getState();
            const exists = store.players.some((p) => p.username === e.username);

            const newPlayer: PublicPlayer = {
                username: e.username,
                amount: e.amount,
                status: "placed",
                multiplier: null,
            };

            store.setPlayers(
                exists
                    ? store.players.map((p) =>
                          p.username === e.username ? newPlayer : p,
                      )
                    : [...store.players, newPlayer],
            );
        });

        socketService.on<PlayersCashoutPayload>(
            SOCKET_EVENTS.PLAYERS_CASHOUT,
            (e) => {
                const store = useGameStore.getState();
                store.setPlayers(
                    store.players.map((p) =>
                        p.username === e.username
                            ? {
                                  ...p,
                                  status: "cashed_out",
                                  multiplier: e.multiplier,
                              }
                            : p,
                    ),
                );
            },
        );

        socketService.on<PlayersLostPayload>(
            SOCKET_EVENTS.PLAYERS_LOST,
            (e) => {
                const store = useGameStore.getState();
                store.setPlayers(
                    store.players.map((p) =>
                        p.username === e.username
                            ? { ...p, status: "lost" }
                            : p,
                    ),
                );
            },
        );

        return () => {
            socketService.off("connect");
            socketService.off("disconnect");
            socketService.off(SOCKET_EVENTS.ROUND_STATE);
            socketService.off(SOCKET_EVENTS.ROUND_WAITING);
            socketService.off(SOCKET_EVENTS.ROUND_START);
            socketService.off(SOCKET_EVENTS.ROUND_TICK);
            socketService.off(SOCKET_EVENTS.ROUND_CRASH);
            socketService.off(SOCKET_EVENTS.BET_PLACED);
            socketService.off(SOCKET_EVENTS.BET_CASHED_OUT);
            socketService.off(SOCKET_EVENTS.BET_LOST);
            socketService.off(SOCKET_EVENTS.BET_REJECTED);
            socketService.off(SOCKET_EVENTS.PLAYERS_BET);
            socketService.off(SOCKET_EVENTS.PLAYERS_CASHOUT);
            socketService.off(SOCKET_EVENTS.PLAYERS_LOST);
        };
    }, [queryClient]);
}
