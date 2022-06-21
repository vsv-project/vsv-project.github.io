import { createContext } from "react"
import { io } from "socket.io-client";

export const Socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
  transports: ["websocket"],
}).connect();

export const SocketContext = createContext<any | undefined>(undefined);