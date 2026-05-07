import type { RoundPhase } from "@/shared/types/gameTypes";

export interface ChartPoint {
    elapsedMs: number;
    multiplier: number;
}

// Exponential multiplier formula matching backend
export function calcMultiplier(elapsedMs: number): number {
    return Math.pow(Math.E, 0.00006 * elapsedMs);
}

// Log scale Y — ln(1.0)=0, equal visual distance = equal relative growth
export function toLogY(multiplier: number): number {
    // TODO choose 1
    // return Math.log(Math.max(multiplier, 1.0)); //log scale
    return Math.pow(Math.max(multiplier - 1, 0), 0.5); // sqrt scale
}

export interface WorldBounds {
    maxElapsedMs: number;
    maxLogY: number;
}

export function getWorldBounds(points: ChartPoint[]): WorldBounds {
    if (points.length === 0) {
        return { maxElapsedMs: 10000, maxLogY: toLogY(2) };
    }

    const lastPoint = points[points.length - 1];
    const maxMultiplier = Math.max(lastPoint.multiplier, 2.0);

    // Add 15% headroom so the curve doesn't hit the top edge
    const maxLogY = toLogY(maxMultiplier) * 1.15;
    const maxElapsedMs = Math.max(lastPoint.elapsedMs, 10000) * 1.1;

    return { maxElapsedMs, maxLogY };
}

export interface CanvasCoord {
    x: number;
    y: number;
}

export const CHART_PADDING = { left: 8, right: 8, top: 32, bottom: 8 };

export function worldToCanvas(
    elapsedMs: number,
    multiplier: number,
    canvasWidth: number,
    canvasHeight: number,
    bounds: WorldBounds,
): CanvasCoord {
    const drawW = canvasWidth - CHART_PADDING.left - CHART_PADDING.right;
    const drawH = canvasHeight - CHART_PADDING.top - CHART_PADDING.bottom;

    const x = CHART_PADDING.left + (elapsedMs / bounds.maxElapsedMs) * drawW;
    const logY = toLogY(multiplier);
    // Y is inverted: 0 (bottom) = 1.0x, maxLogY (top) = maxMultiplier
    const y = CHART_PADDING.top + drawH - (logY / bounds.maxLogY) * drawH;

    return { x, y };
}

export type ChartColors = {
    line: string;
    fill: string;
    text: string;
    subtext: string;
};

export function getChartColors(phase: RoundPhase): ChartColors {
    if (phase === "crashed") {
        return {
            line: "#ef4444",
            fill: "rgba(239,68,68,0.15)",
            text: "#ef4444",
            subtext: "rgba(239,68,68,0.6)",
        };
    }
    return {
        line: "#22c55e",
        fill: "rgba(34,197,94,0.12)",
        text: "#22c55e",
        subtext: "rgba(34,197,94,0.5)",
    };
}

export function drawWaiting(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    endsAt: Date | null,
) {
    const secsLeft = endsAt
        ? Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000))
        : 0;

    ctx.textAlign = "center";
    ctx.fillStyle = "#f0b429";
    ctx.font = `bold ${Math.min(W * 0.1, 72)}px monospace`;
    ctx.fillText(`${secsLeft}s`, W / 2, H / 2);

    ctx.fillStyle = "rgba(240,180,41,0.5)";
    ctx.font = `${Math.min(W * 0.025, 16)}px monospace`;
    ctx.fillText(
        "Next round starting...",
        W / 2,
        H / 2 + Math.min(W * 0.06, 40),
    );
}
