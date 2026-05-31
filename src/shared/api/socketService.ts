import { io, Socket } from "socket.io-client";
import { APP_CONSTANTS } from "@/shared/constants/appConstants";

class SocketService {
    private socket: Socket | null = null;

    /**
     * Phase 1 — creates the socket instance but does NOT open the connection.
     * Register all event listeners via on() before calling open().
     */
    connect(apiKey: string): void {
        if (this.socket) return;

        this.socket = io(APP_CONSTANTS.SOCKET_URL, {
            auth: { apiKey },
            autoConnect: false, // connection is opened explicitly via open()
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
    }

    /**
     * Phase 2 — opens the connection.
     * Must be called after all listeners are registered to avoid missing
     * events that the server emits immediately on connect (e.g. ROUND_STATE).
     */
    open(): void {
        this.socket?.connect();
    }

    disconnect(): void {
        if (!this.socket) return;
        this.socket.disconnect();
        this.socket = null;
    }

    /**
     * Registers an event handler and returns an unsubscribe function.
     * Always call the returned function in cleanup to remove only this
     * handler, leaving any other listeners for the same event untouched.
     */
    on<T>(event: string, handler: (payload: T) => void): () => void {
        if (!this.socket) return () => {};
        this.socket.on(event, handler);
        return () => {
            this.socket?.off(event, handler);
        };
    }

    off<T>(event: string, handler?: (payload: T) => void): void {
        if (!this.socket) return;
        this.socket.off(event, handler);
    }

    /**
     * Emits an event and returns whether the socket was connected.
     * Returns false when disconnected so callers can roll back optimistic
     * UI state (e.g. actionInFlight) instead of leaving the UI stuck.
     */
    emit<T>(event: string, payload?: T): boolean {
        if (!this.socket?.connected) return false;
        this.socket.emit(event, payload);
        return true;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();
