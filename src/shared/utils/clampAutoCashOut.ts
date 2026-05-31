import { APP_CONSTANTS } from "../constants/appConstants";

export const clamp = (
    value: number,
    min: number,
    max: number = Infinity,
): number => {
    return Math.max(min, Math.min(value, max));
};

export function clampAutoCashOut(value: number): number {
    return clamp(value, APP_CONSTANTS.MIN_AUTO_CASHOUT);
}
