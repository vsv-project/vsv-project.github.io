import { createContext } from "react"
import { io } from "socket.io-client";


export const socket = io("https://vsv-project.herokuapp.com/wss", {
    transports: ["websocket"],
    }).connect();

//export const socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
//    transports: ["websocket"],
//    }).connect();

export const SocketContext = createContext<any | undefined>(undefined);