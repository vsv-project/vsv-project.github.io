/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth, AuthProvider, DbProvider, auth, getRef } from "./context/firebase";
import { onValue } from "firebase/database"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential} from "firebase/auth"


const Home = () => {
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: UserCredential) => {
      // Sign up successful. 
      const user = userCredential.user
      console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Sign in sucessful.
      const user = userCredential.user
      console.log("user:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  const signout = () => signOut(auth)
    .then(() => {
      console.log(auth.currentUser);
      // Sign-out successful.
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <>
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
        <button type="button" onClick={() => signout()}>Signout</button>
        <button type="button" onClick={() => signup(email, password)}>Signup</button>
      </form>
      {!user ? <p>Not logged in</p> : <p>Logged in as {user.email}</p>}
    </>
  )
}

const Channels = () => {
  const user = useAuth();
  const [channels, setChannels] = useState<any | undefined>(undefined)
  
  useEffect(() => {
    if (user !== null) {
      const publicChannels = getRef(`/users/${user.uid}/channels/`)
      const unsubscribe = onValue(publicChannels, (snapshot) => {
        console.log(snapshot)
        setChannels(Object.keys(snapshot.val()))
      }, (error) => {
        console.error(error)
      })
      return () => {
        unsubscribe()
      }
    }
    
  }, [user])

  return (
    <>
      <Link to="/">Home</Link>
      {channels !== undefined ? JSON.stringify(channels) : "no channels"}
      {/*{channels !== undefined && channels !== null && Object.keys(channels).length > 0
              ?   channels.map((channel, key) => (
                      <div key={key}>
                          Name: {channel.name} <br/>
                      </div>
                  ))
              :   <div>
                      Loading...
                  </div>
      }*/}
    </>
  )
}

const Channel = () => {
  const location = useLocation()
  const user = useAuth();
  const [channel, setChannel] = useState<any | undefined>(null)
  const [error, setError] = useState<any | undefined>(null)

  useEffect(() => {
    if (!user) {
      console.log(user)
      setError({error: "Not logged in"})
    } else {
      const channelRef = getRef(`/channels/${location.pathname.split("/")[2]}`)
      const unsubscribe = onValue(channelRef, (snapshot) => {
        console.log(snapshot)
        setChannel(snapshot.val())
        setError(null)
      }, (error) => {
        console.error(error)
        setError(error)
      })
      return unsubscribe
    }
  }, [user])
  return (
    <>
      <Link to="/">Home</Link>
      <br/>
      {error ? <p>{JSON.stringify(error)}</p> : null}
      {(channel !== null && channel !== undefined) || !error ? JSON.stringify(channel) : null}
    </>
  )

}

const App = () => {
  return (
    <>
      <AuthProvider>
        <DbProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/channels" element={<Channels />}/>
              <Route path="/c/:channel" element={<Channel />}/>
            </Routes>
          </Router>
        </DbProvider>
      </AuthProvider>
    </>
  )
} 
export default App