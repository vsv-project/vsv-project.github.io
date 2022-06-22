import { createContext, useEffect, useState, useContext } from "react"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase, ref } from "firebase/database"

const config = {"apiKey": "AIzaSyBDK0n1WIWcU6h-_OrmtqvAY1acBRS7fHg","authDomain": "clompass-chat-app.firebaseapp.com","projectId": "clompass-chat-app","storageBucket": "clompass-chat-app.appspot.com","messagingSenderId": "319826122916","appId": "1:319826122916:web:44bf4e1bc13acdc8b4ae31"}

const firebase = initializeApp(config)
const auth = getAuth(firebase)
const db = getDatabase(firebase, "https://clompass-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app")

const DbContext = createContext<any | undefined>(undefined)
const AuthContext = createContext<any | undefined>(undefined);

const AuthProvider: React.FC<any> = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const value = { user };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
  
function useAuth() {
  const context = useContext<any>(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within a AuthProvider"
    );
  }
  return context.user;
}
const DbProvider: React.FC<any> = ({children}: any) => {
  const database = db
  return (
    <DbContext.Provider value={database}>
      {children}
    </DbContext.Provider>
  )
}
function useDb() {
  const context = useContext<any>(DbContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context.user;

}
function getRef(url: string) {
  return ref(db, url)
}
export { AuthProvider, useAuth, DbProvider, useDb, auth, getRef };