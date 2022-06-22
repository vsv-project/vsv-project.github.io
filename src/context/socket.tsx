import { createContext, useEffect, useContext, useCallback } from "react"
import { io } from "socket.io-client";

const Socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
  transports: ["websocket"],
}).connect();

const SocketContext = createContext<any | undefined>(undefined);

const SocketProvider: React.FC<any> = ({ children }: any) => {
  const value = Socket

  const onConnection = () => useCallback(() => {
    console.log("connected to socket")
  },[])

  const onDisconnection = () => useCallback(() => {
    console.log("disconnected from socket")
  },[])

  useEffect(() => {
    Socket.on("connection", onConnection)
    Socket.on("disconnect", onDisconnection)
    return () => {
      Socket.off("connection", onConnection)
      Socket.off("disconnect", onDisconnection)
    }
  }, []);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
function useSocket() {
  const context = useContext<any>(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocket must be used within a SocketProvider"
    );
  }
  return context
}
  
export { SocketProvider, useSocket };