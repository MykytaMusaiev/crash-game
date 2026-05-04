export const SOCKET_EVENTS = {
    // Server → Client
    ROUND_STATE: "round:state",
    ROUND_WAITING: "round:waiting",
    ROUND_START: "round:start",
    ROUND_TICK: "round:tick",
    ROUND_CRASH: "round:crash",
    BET_PLACED: "bet:placed",
    BET_CASHED_OUT: "bet:cashedOut",
    BET_LOST: "bet:lost",
    BET_REJECTED: "bet:rejected",
    // Client → Server
    BET_PLACE: "bet:place",
    BET_CASHOUT: "bet:cashout",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
