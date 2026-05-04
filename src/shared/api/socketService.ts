import { io, Socket } from "socket.io-client";
import { APP_CONSTANTS } from "@/shared/constants/appConstants";

class SocketService {
    private socket: Socket | null = null;

    connect(apiKey: string): void {
        if (this.socket) return;

        this.socket = io(APP_CONSTANTS.SOCKET_URL, {
            auth: { apiKey },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
    }

    disconnect(): void {
        if (!this.socket) return;
        this.socket.disconnect();
        this.socket = null;
    }

    on<T>(event: string, handler: (payload: T) => void): void {
        if (!this.socket) return;
        this.socket.on(event, handler);
    }

    off<T>(event: string, handler?: (payload: T) => void): void {
        if (!this.socket) return;
        this.socket.off(event, handler);
    }

    emit<T>(event: string, payload?: T): void {
        if (!this.socket?.connected) return;
        this.socket.emit(event, payload);
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();
