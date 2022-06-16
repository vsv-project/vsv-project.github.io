import React, { useContext, createContext, useState } from "react";

const AuthContext = createContext<{auth: any, setAuth: Function} | undefined> (undefined);
export default function NestedContextTest() {
    const [auth, setAuth] = useState(1);
    return (
        <React.Fragment>
            <AuthContext.Provider value={{auth, setAuth}}>
                <Parent />
                <Child />
            </AuthContext.Provider>
        </React.Fragment>
    )
}
const Parent = () => {
    return (
        <>
            <Child/>
        </>
    )
}
const checkContext = (ctx: React.Context<any>) => {
    const context = useContext(ctx)
    if (context !== undefined) {
        return context
    } else {
        throw new Error("it no worke")
    }
}
const Child = () => {
    const {auth, setAuth} = checkContext(AuthContext)
        return (
            <>
                {auth}
                <button onClick={() => setAuth(auth+1)}>add 1</button>
            </>
        )
    }