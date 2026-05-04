export type PlayerStatus = "bet" | "cashedOut" | "lost";

export interface LivePlayer {
    id: string;
    username: string;
    betAmount: number;
    status: PlayerStatus;
    cashOutMultiplier?: number;
}

// REST: GET /api/balance
export interface BalanceResponse {
    balance: number;
}

// REST: GET /api/history
export interface HistoryBet {
    betId: string;
    roundId: string;
    amount: number;
    cashOutMultiplier: number | null;
    winAmount: number | null;
    profit: number | null;
    createdAt: string;
}

// REST: GET /api/rounds/recent
export interface RecentRound {
    roundId: string;
    crashPoint: number;
    startedAt: string;
}
