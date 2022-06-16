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
const Child = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        return (
            <>
                bruh
            </>
        )
    } else {
        return (
            <>
                {context.auth}
                <button onClick={() => context.setAuth(context.auth++)}>add 1</button>
            </>
        )
    }
    
}