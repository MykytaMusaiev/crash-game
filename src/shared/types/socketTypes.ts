import type { RoundPhase, MyBet } from "./gameTypes";

// ─── Server → Client ────────────────────────────────────────────

export interface RoundStatePayload {
    phase: RoundPhase;
    roundId: string;
    startedAt: string | null;
    endsAt: string | null;
    currentMultiplier: number;
    crashPoint: number | null;
    yourBet: (Omit<MyBet, "betId"> & { betId?: string }) | null;
    playerCount: number;
}

export interface RoundWaitingPayload {
    roundId: string;
    endsAt: string;
    playerCount: 0;
}

export interface RoundStartPayload {
    roundId: string;
    startedAt: string;
    playerCount: number;
}

export interface RoundTickPayload {
    roundId: string;
    multiplier: number;
    elapsedMs: number;
}

export interface RoundCrashPayload {
    roundId: string;
    crashPoint: number;
    playerCount: number;
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
