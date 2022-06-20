import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";
import { AuthContext } from "./context/auth";
import useContextCheck from "./context/useContextCheck";
import UserContext from "./UserContext";
import ContextTester from "./ContextTester";

type channel = {
    name: any;
    id: any;
    members: any[];
    messages: any[];
}

const Home = () => {
    const {auth, setAuth} = useContextCheck(AuthContext)
    const socket = useContextCheck(SocketContext)
    const user = "😁";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signup = (email: string, password: string) => {
        socket.emit("signup", {email, password});
    }
    const login = (email: string, password: string) => {
        socket.emit("login", {email, password});
    }
    const signout = () => {
        socket.emit("signout")
    }
    const signupListener = useCallback((data: any) => {
        console.log(data)
        setAuth(data.data.user)
    }, [setAuth]);
    const loginListener = useCallback((data: any) => {
        console.log(data)
        setAuth(data.data.user)
    }, [setAuth]);
    const signoutListener = useCallback((data: any) => {
        console.log(data)
        setAuth(data.data.user)
    }, [setAuth]);

    useEffect(() => {
        socket.on("signup", signupListener)
        socket.on("login", loginListener)
        socket.on("signout", signoutListener)
        return () => {
            socket.off("signup", signupListener)
            socket.off("login", loginListener)
            socket.off("signout", signoutListener)
        }
    }, [socket, signupListener, loginListener, signoutListener])
    return (
        <UserContext.Provider value={user}>
            <h1>
                Home
            </h1>
            <br/>
            <Link to="/channels">
                <button>Channels</button>
            </Link>
            <br/>
            <form>
                <input type="email" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => login(email, password)}>Login</button>
                <button type="button" onClick={() => signup(email, password)}>Signup</button>
                <button type="button" onClick={() => signout()}>Signout</button>
            </form>
            {!auth ? <p>Not logged in</p> : <p>Logged in as {auth.email}</p>}
            <ContextTester />
        </UserContext.Provider>
    )
}

const Channels = () => {
    const socket = useContextCheck(SocketContext)
    const [channels, setChannels] = useState<any[] | undefined>([])

    const channelListener = useCallback((data: any) => {
        if (data.status === "success") {
            let channels = [];
            let channelsKeys = Object.keys(data.data.channels)
            for (let i = 0; i < channelsKeys.length; i++) {
                let members = [];
                let messages = [];
                let channel: channel = {
                    id: data.data.channels[channelsKeys[i]].id,
                    name: data.data.channels[channelsKeys[i]].name,
                    members: [],
                    messages: [],

                };
                let membersKeys = Object.keys(data.data.channels[channelsKeys[i]].members)
                let messagesKeys = Object.keys(data.data.channels[channelsKeys[i]].messages)
                for (let j = 0; j < membersKeys.length; j++) {
                   members.push(data.data.channels[channelsKeys[i]].members[membersKeys[j]])
                }
                for (let j = 0; j < messagesKeys.length; j++) {
                    messages.push(data.data.channels[channelsKeys[i]].messages[messagesKeys[j]])
                }
                channel.members = members;
                channel.messages = messages;
                channels.push(channel);
                
            }
            setChannels(channels)
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
            <Link to="/">Home</Link>
            {channels !== undefined && Object.keys(channels).length > 0
                ?   channels.map((channel, key) => (
                        <div key={key}>{channel.name}, {channel.members.map((member: any, index:number) => <div key={index}>{member.name}</div>)}</div>
                ))
                :   <div>Loading...</div>
        }
        </>
    )
}

const App = () => {
    const [auth, setAuth] = useState<any | undefined>(null);
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