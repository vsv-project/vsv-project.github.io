import { useContext, createContext, useState } from "react";

export default function NestedContextTest() {
    const [auth, setAuth] = useState(null);
    const AuthContext = createContext(auth);

}