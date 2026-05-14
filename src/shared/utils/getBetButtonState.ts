import { APP_CONSTANTS } from "../constants/appConstants";
import { MyBet, RoundPhase } from "../types/gameTypes";

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
    balance: number;
    multiplier: number;
}

export function getBetButtonState({
    phase,
    myBet,
    actionInFlight,
    crashPoint,
    hadBetThisRound,
    hadCashedOutThisRound,
    cashedOutWinAmount,
    balance,
    multiplier,
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
            className: "text-white font-semibold",
        };
    }
    if (phase === "running" && myBet?.status === "placed") {
        return {
            label: `Cash Out +$${(myBet.amount * multiplier).toFixed(2)}`,
            variant: "primary",
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
    if (phase === "waiting" && myBet !== null) {
        return {
            label: "Waiting for start",
            variant: "secondary",
            disabled: true,
            className: "",
        };
    }
    if (balance < APP_CONSTANTS.MIN_BET_AMOUNT) {
        return {
            label: "⚠ Insufficient Funds",
            variant: "secondary",
            disabled: true,
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
    return {
        label: "Wait for next round",
        variant: "secondary",
        disabled: true,
        className: "",
    };
}
