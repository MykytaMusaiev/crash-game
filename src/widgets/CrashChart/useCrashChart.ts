import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import type { ChartPoint } from "./chartUtils";
import {
    getWorldBounds,
    worldToCanvas,
    getChartColors,
    CHART_PADDING,
    drawWaiting,
} from "./chartUtils";

export function useCrashChart(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
    const pointsRef = useRef<ChartPoint[]>([]);
    const rafRef = useRef<number | null>(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const state = useGameStore.getState();
        const { phase, multiplier } = state;
        const points = pointsRef.current;
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.width / dpr;
        const H = canvas.height / dpr;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        if (phase === "waiting") {
            drawWaiting(ctx, W, H, state.endsAt);
            ctx.restore();
            return;
        }

        if (points.length < 2) {
            ctx.restore();
            return;
        }

        const colors = getChartColors(phase);
        const bounds = getWorldBounds(points);

        const coords = points.map((p) =>
            worldToCanvas(p.elapsedMs, p.multiplier, W, H, bounds),
        );

        // Fill under curve
        ctx.beginPath();
        ctx.moveTo(coords[0].x, H - CHART_PADDING.bottom);
        coords.forEach((c) => ctx.lineTo(c.x, c.y));
        ctx.lineTo(coords[coords.length - 1].x, H - CHART_PADDING.bottom);
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        coords.forEach((c) => ctx.lineTo(c.x, c.y));
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();

        // Dot at tip
        const tip = coords[coords.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.line;
        ctx.fill();

        // Center multiplier text
        const displayMultiplier =
            phase === "crashed"
                ? (useGameStore.getState().crashPoint ?? multiplier)
                : multiplier;

        ctx.textAlign = "center";
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${Math.min(W * 0.1, 72)}px monospace`;
        ctx.fillText(`${displayMultiplier.toFixed(2)}×`, W / 2, H / 2);

        if (phase === "crashed") {
            ctx.fillStyle = colors.subtext;
            ctx.font = `${Math.min(W * 0.025, 18)}px monospace`;
            ctx.fillText("CRASHED", W / 2, H / 2 + Math.min(W * 0.06, 40));
        }

        ctx.restore();
    }, [canvasRef]);

    const startLoop = useCallback(() => {
        const loop = () => {
            draw();
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
    }, [draw]);

    const stopLoop = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    useEffect(() => {
        const unsub = useGameStore.subscribe((state, prev) => {
            if (state.phase === "waiting" && prev.phase !== "waiting") {
                pointsRef.current = [{ elapsedMs: 0, multiplier: 1.0 }];
            }

            if (
                state.phase === "running" &&
                state.multiplier !== prev.multiplier
            ) {
                const elapsedMs = state.startedAt
                    ? Date.now() - state.startedAt.getTime()
                    : 0;
                pointsRef.current.push({
                    elapsedMs,
                    multiplier: state.multiplier,
                });
            }

            if (state.phase === "crashed" && prev.phase === "running") {
                if (state.crashPoint !== null) {
                    const lastMs =
                        pointsRef.current.length > 0
                            ? pointsRef.current[pointsRef.current.length - 1]
                                  .elapsedMs
                            : 0;
                    pointsRef.current.push({
                        elapsedMs: lastMs,
                        multiplier: state.crashPoint,
                    });
                }
            }
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        startLoop();
        return () => stopLoop();
    }, [startLoop, stopLoop]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                const dpr = window.devicePixelRatio || 1;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
            }
        });
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [canvasRef]);
}
