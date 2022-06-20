import { createContext } from "react"
import { Auth } from "firebase/auth"
type AuthContextProps = {
    auth: Auth | any | undefined,
    setAuth: (auth: Auth | any | undefined) => void
}
export const AuthContext = createContext<AuthContextProps | any | undefined>(undefined);