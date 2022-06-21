import { createContext } from "react"
type AuthContextProps = {
  auth: any | undefined,
  setAuth: (auth: any | undefined) => void
}
export const AuthContext = createContext<AuthContextProps | any | undefined>(undefined);