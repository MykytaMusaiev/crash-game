import { APP_CONSTANTS } from "../constants/appConstants";

export function clampBet(value: number, balance: number): number {
    return Math.max(APP_CONSTANTS.MIN_BET_AMOUNT, Math.min(value, balance));
}
