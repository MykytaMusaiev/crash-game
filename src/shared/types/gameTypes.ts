export type RoundPhase = "waiting" | "running" | "crashed";

export type MyBetStatus = "placed" | "cashedOut" | "lost";

export interface MyBet {
    betId: string;
    amount: number;
    autoCashOutAt: number | null;
    status: MyBetStatus;
}

export interface RoundState {
    phase: RoundPhase;
    roundId: string | null;
    startedAt: Date | null;
    endsAt: Date | null;
    currentMultiplier: number;
    crashPoint: number | null;
    myBet: MyBet | null;
    playerCount: number;
}
