import type { RoundPhase } from "@/shared/types/gameTypes";
import type { MyBet } from "@/shared/types/gameTypes";

export interface BetButtonState {
    label: string;
    variant: "primary" | "secondary" | "danger" | "success";
    disabled: boolean;
    className: string;
}

export interface BetButtonParams {
    phase: RoundPhase;
    myBet: MyBet | null;
    actionInFlight: boolean;
    crashPoint: number | null;
    hadBetThisRound: boolean;
    hadCashedOutThisRound: boolean;
    cashedOutWinAmount: number | null;
}

export function getBetButtonState({
    phase,
    myBet,
    actionInFlight,
    crashPoint,
    hadBetThisRound,
    hadCashedOutThisRound,
    cashedOutWinAmount,
}: BetButtonParams): BetButtonState {
    if (actionInFlight) {
        return {
            label: "Waiting...",
            variant: "secondary",
            disabled: true,
            className: "animate-pulse opacity-50",
        };
    }
    if (hadCashedOutThisRound) {
        return {
            label: `Cashed Out ✓  +$${cashedOutWinAmount!.toFixed(2)}`,
            variant: "success",
            disabled: true,
            className: "font-semibold",
        };
    }
    if (phase === "running" && myBet?.status === "placed") {
        return {
            label: "Cash Out",
            variant: "primary",
            disabled: false,
            className: "",
        };
    }
    if (phase === "waiting" && myBet === null) {
        return {
            label: "Place Bet",
            variant: "success",
            disabled: false,
            className: "",
        };
    }
    if (phase === "crashed" && hadBetThisRound) {
        return {
            label: `Crashed @ ${(crashPoint ?? 0).toFixed(2)}×`,
            variant: "danger",
            disabled: true,
            className: "",
        };
    }
    return {
        label: "Wait for next round",
        variant: "secondary",
        disabled: true,
        className: "",
    };
}
