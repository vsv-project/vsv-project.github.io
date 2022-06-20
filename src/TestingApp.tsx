import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";
import { AuthContext } from "./context/auth";
import useContextCheck from "./context/useContextCheck";
import UserContext from "./UserContext";
import ContextTester from "./ContextTester";


const Home = () => {
    const {auth, setAuth} = useContextCheck(AuthContext)
    const socket = useContextCheck(SocketContext)
    const user = "😁";
    return (
        <UserContext.Provider value={user}>
            <h1>
                Home
            </h1>
            {auth}
            <button type="button" onClick={() => setAuth(1+auth)}>Add 1 to auth</button>
            <button type="button" onClick={() => console.log(socket)}>Console log socket</button>
            <br/>
            <ContextTester />
        </UserContext.Provider>
    )
}

const Channels = () => {
    const socket = useContextCheck(SocketContext)
    const [channels, setChannels] = useState<any[] | undefined>([])

    const channelListener = useCallback((data: any) => {
        if (data.status === "success") {
            setChannels(data.data.channels)
        } else {
            setChannels(data.data.error)
        }
    }, [])
    useEffect(() => {
        socket.on("getChannels", channelListener)
        socket.emit("getChannels")
        return () => {
            socket.off("getChannels", channelListener)
        }
    }, [channelListener, socket])
    return (
        <>
            {channels 
                ?   channels.map((channel, key) => (
                        <div key={key}>{channel}</div>
                ))
                :   <div>Loading...</div>
        }
        </>
    )
}

const App = () => {
    const [auth, setAuth] = useState<any | undefined>(0);
    const connect = useCallback(() => {
        console.log("connected to socket")
    }, []) 

    const disconnect = useCallback(() => {
        console.log("disconnected from socket")
    }, []) 
    useEffect(() => {
        socket.on("connect", connect)
        socket.on("disconnect", disconnect)
        return () => {
            socket.off("connect", connect)
            socket.off("disconnect", disconnect)
        }
    }, [connect, disconnect])

    return (
        <>
            <SocketContext.Provider value={socket}>
                <AuthContext.Provider value={{auth, setAuth}}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/channels" element={<Channels />}/>
                        </Routes>
                    </Router>
                </AuthContext.Provider>
            </SocketContext.Provider>
        </>
    )
} 
export default App