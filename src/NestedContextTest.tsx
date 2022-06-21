import React, { useContext, createContext, useState } from "react";

const AuthContext = createContext<{auth: any, setAuth: Function} | undefined> (undefined);
type ProviderProps = {children: React.ReactNode}

const Parent = ({children}: ProviderProps) => {
  return (
    <>
      {children}
    </>
  )
}
const useContextCheck = (ctx: React.Context<any>) => {
  const context = useContext(ctx)
  if (context !== undefined) {
    return context
  } else {
    throw new Error("it no worke")
  }
}
const Child = () => {
  const {auth, setAuth} = useContextCheck(AuthContext)
  const setAuth2 = (num: Number) => {
    console.log(auth, num)
    let x = auth;
    setAuth(x + num)
  }
  return (
    <>
      {auth}
      <button onClick={() => setAuth2(1)}>add 1</button>
    </>
  )
}

export default function NestedContextTest() {
  const [auth, setAuth] = useState(1);
  return (
    <React.Fragment>
      <AuthContext.Provider value={{auth, setAuth}}>
        <Parent>
          <Child/>
        </Parent>
        <Child />
      </AuthContext.Provider>
    </React.Fragment>
  )
}
