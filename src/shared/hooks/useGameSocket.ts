"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/shared/api/socketService";
import { useGameStore } from "@/store/gameStore";
import { SOCKET_EVENTS } from "@/shared/constants/socketEvents";
import { APP_CONSTANTS } from "@/shared/constants/appConstants";
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
    RecentRound,
    RecentRoundsResponse,
} from "@/shared/types/playerTypes";
import type { RoundTier } from "@/shared/types/gameTypes";
import { audioService } from "../api/audioService";

export function useGameSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const { setConnected } = useGameStore.getState();
        // Collect unsubscribe functions so cleanup removes only our handlers,
        // not every listener for the event (socket.off(event) without a handler
        // would nuke listeners owned by other hooks/components).
        const unsubs: Array<() => void> = [];

        // Connection state
        unsubs.push(socketService.on("connect", () => setConnected(true)));
        unsubs.push(
            socketService.on("disconnect", () => {
                setConnected(false);
                audioService.play("disconnected");
            }),
        );

        // Sync in case the socket was already connected before this hook mounted
        setConnected(socketService.isConnected());

        unsubs.push(
            socketService.on<RoundStatePayload>(
                SOCKET_EVENTS.ROUND_STATE,
                (e) => {
                    const store = useGameStore.getState();
                    store.setPhase(e.phase);
                    store.setRoundId(e.roundId);
                    store.setMultiplier(e.currentMultiplier);
                    store.setStartedAt(
                        e.startedAt ? new Date(e.startedAt) : null,
                    );
                    store.setEndsAt(e.endsAt ? new Date(e.endsAt) : null);
                    store.setCrashPoint(e.crashPoint);
                    store.setMyBet(e.yourBet);
                    store.setPlayers(e.players);
                },
            ),
        );

        unsubs.push(
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
                    store.setHadCashedOutThisRound(false);
                    store.setMyBet(null);
                    store.setCashedOutWinAmount(null);
                    store.setPlayers(e.players);
                },
            ),
        );

        unsubs.push(
            socketService.on<RoundStartPayload>(
                SOCKET_EVENTS.ROUND_START,
                (e) => {
                    const store = useGameStore.getState();
                    store.setPhase("running");
                    store.setRoundId(e.roundId);
                    store.setStartedAt(new Date(e.startedAt));
                    store.setEndsAt(null);
                    store.setMultiplier(1.0);
                    store.setPlayers(e.players);
                    audioService.play("start");
                },
            ),
        );

        unsubs.push(
            socketService.on<RoundTickPayload>(
                SOCKET_EVENTS.ROUND_TICK,
                (e) => {
                    const store = useGameStore.getState();
                    if (e.roundId !== store.roundId) return;
                    store.setMultiplier(e.multiplier);
                    audioService.play("tick");
                },
            ),
        );

        unsubs.push(
            socketService.on<RoundCrashPayload>(
                SOCKET_EVENTS.ROUND_CRASH,
                (e) => {
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
                            // Prepend and cap to the configured limit so the
                            // list doesn't grow unboundedly over a long session.
                            const updated = [newRound, ...(prev?.rounds ?? [])];
                            return {
                                rounds: updated.slice(
                                    0,
                                    APP_CONSTANTS.RECENT_ROUNDS_LIMIT,
                                ),
                            };
                        },
                    );
                },
            ),
        );

        unsubs.push(
            socketService.on<BetPlacedPayload>(
                SOCKET_EVENTS.BET_PLACED,
                (e) => {
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
                },
            ),
        );

        unsubs.push(
            socketService.on<BetCashedOutPayload>(
                SOCKET_EVENTS.BET_CASHED_OUT,
                (e) => {
                    const store = useGameStore.getState();
                    store.setBalance(e.balance);
                    store.setHadBetThisRound(true);
                    store.setHadCashedOutThisRound(true);
                    store.setMyBet(null);
                    store.setActionInFlight(false);
                    store.setCashedOutWinAmount(e.winAmount);
                    audioService.play("cashout");
                },
            ),
        );

        unsubs.push(
            socketService.on<BetLostPayload>(SOCKET_EVENTS.BET_LOST, (e) => {
                const store = useGameStore.getState();
                store.setBalance(e.balance);
                store.setHadBetThisRound(true);
                store.setMyBet(null);
                store.setActionInFlight(false);
            }),
        );

        unsubs.push(
            socketService.on<BetRejectedPayload>(
                SOCKET_EVENTS.BET_REJECTED,
                (e) => {
                    useGameStore.getState().setActionInFlight(false);
                    console.warn("Bet rejected:", e.reason, e.message);
                },
            ),
        );

        unsubs.push(
            socketService.on<PlayersBetPayload>(
                SOCKET_EVENTS.PLAYERS_BET,
                (e) => {
                    const store = useGameStore.getState();
                    const exists = store.players.some(
                        (p) => p.username === e.username,
                    );

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
                },
            ),
        );

        unsubs.push(
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
            ),
        );

        unsubs.push(
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
            ),
        );

        // Open the connection only AFTER all listeners are in place so the
        // server's initial ROUND_STATE (sent immediately on connect) is never
        // missed due to a listener-registration gap.
        socketService.open();

        return () => {
            unsubs.forEach((fn) => fn());
        };
    }, [queryClient]);
}
