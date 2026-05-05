import type { RoundTier } from "./gameTypes";

// ─── Player ─────────────────────────────────────────────────────

export type PublicPlayerStatus = "placed" | "cashed_out" | "lost";

export interface PublicPlayer {
    username: string;
    amount: number;
    status: PublicPlayerStatus;
    multiplier: number | null; // set only when status=cashed_out
}

// ─── REST: GET /api/balance ──────────────────────────────────────

export interface BalanceResponse {
    balance: number;
}

// ─── REST: GET /api/rounds/recent ───────────────────────────────

export interface RecentRound {
    roundId: string;
    crashPoint: number;
    crashedAt: string;
    tier: RoundTier;
}

export interface RecentRoundsResponse {
    rounds: RecentRound[];
}
