import { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useContextCheck from "./useContextCheck";
import { Auth } from "firebase/auth"
import { Socket, io } from "socket.io-client";


const Home = () => {
    const {auth, setAuth} = useContextCheck(AuthContext)
    return (
        <>
            <h1>
                Home
            </h1>
            {auth}
            <button type="button" onClick={() => setAuth(1)} ></button>
        </>
    )
}


type AuthContextProps = {
    auth: Auth | any | undefined,
    setAuth: (auth: Auth | undefined) => void
}

const SocketContext = createContext<Socket | undefined>(undefined);
const AuthContext = createContext<AuthContextProps | undefined> (undefined)

const App = () => {
    const [auth, setAuth] = useState<Auth | any | undefined>(0);
    let socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
        transports: ["websocket"],
      }).connect();

    return (
        <>
            <SocketContext.Provider value={socket}>
                <AuthContext.Provider value={{auth, setAuth}}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </Router>
                </AuthContext.Provider>
            </SocketContext.Provider>
        </>
    )
} 
export default App