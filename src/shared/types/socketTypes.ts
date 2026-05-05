import type { RoundPhase, MyBet } from "./gameTypes";
import type { PublicPlayer } from "./playerTypes";

// ─── Server → Client ────────────────────────────────────────────

export interface RoundStatePayload {
    phase: RoundPhase;
    roundId: string;
    startedAt: string | null;
    endsAt: string | null;
    currentMultiplier: number;
    crashPoint: number | null;
    yourBet: MyBet | null;
    players: PublicPlayer[];
}

export interface RoundWaitingPayload {
    roundId: string;
    endsAt: string;
    players: PublicPlayer[];
}

export interface RoundStartPayload {
    roundId: string;
    startedAt: string;
    players: PublicPlayer[];
}

export interface RoundTickPayload {
    roundId: string;
    multiplier: number;
    elapsedMs: number;
}

export interface RoundCrashPayload {
    roundId: string;
    crashPoint: number;
    tier: string;
    players: PublicPlayer[];
}

export interface BetPlacedPayload {
    betId: string;
    roundId: string;
    amount: number;
    autoCashOutAt: number | null;
    balance: number;
}

export interface BetCashedOutPayload {
    betId: string;
    multiplier: number;
    winAmount: number;
    profit: number;
    balance: number;
}

export interface BetLostPayload {
    betId: string;
    crashPoint: number;
    balance: number;
}

export interface BetRejectedPayload {
    reason: BetRejectReason;
    message: string;
}

export interface PlayersBetPayload {
    username: string;
    amount: number;
}

export interface PlayersCashoutPayload {
    username: string;
    multiplier: number;
    winAmount: number;
}

export interface PlayersLostPayload {
    username: string;
    amount: number;
}

// ─── Client → Server ────────────────────────────────────────────

export interface BetPlaceEmit {
    amount: number;
    autoCashOutAt?: number | null;
}

// ─── Reject reasons ─────────────────────────────────────────────

export type BetRejectReason =
    | "betting_closed"
    | "already_has_bet"
    | "no_active_bet"
    | "not_running"
    | "insufficient_balance"
    | "invalid_auto_cashout"
    | "invalid_payload";
