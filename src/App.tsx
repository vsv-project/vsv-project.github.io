/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth, AuthProvider, DbProvider, useUserAuth, getRef, signOutUser, signUpUser, signInUser } from "./context/firebase";
import { onValue, set, push } from "firebase/database"
import "../node_modules/bootstrap/scss/bootstrap.scss"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"  
import { Navbar, Offcanvas, Nav, Form, Button, Stack, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";

const LoginOffcanvas = (props: any) => {
  const state = props.state
  const setState = props.setState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  return (
    <>
      <Offcanvas show={state} onHide={() => setState(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button type="button" onClick={() => signInUser(email, password)}>Login</Button>
            <Button type="button" onClick={() => signUpUser(email, password)}>Sign up</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

const AppNavbar = () => {
  const auth = useAuth()
  const [userStatus, setUserStatus] = useState<boolean>(!auth.currentUser ? false : true)
  const [navbarStatus, setNavbarStatus] = useState<boolean>(false)
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setNavbarStatus(false)
      if (user) {
        setUserStatus(true)
      } else {
        setUserStatus(false)
      }
    })
  }, [])
  

  //const location = useLocation()
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>
          <LinkContainer to="/">
            <div> 
              VSV Chat App
            </div> 
          </LinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {userStatus 
              ?  
              <>
                <LinkContainer to="/channels">
                  <Nav.Link as="a">Channels</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={() => signOutUser()}>Signout</Nav.Link>
              </>
              : 
              <>
                <Nav.Link onClick={() => setNavbarStatus(true)}>Login</Nav.Link>
              </>
            }

          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginOffcanvas state={navbarStatus} setState={setNavbarStatus} />
    </>
  )
}

const Home = () => {
  const user = useUserAuth();
  return (
    <>
      <h1>
          Home
      </h1>
      <br/>
      {!user ? <p>Not logged in</p> : <p>Logged in as {user.email}</p>}
    </>
  )
}

const Channels = () => {
  const user = useUserAuth();
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
      <h1>
        Channels
      </h1>
      {channels !== undefined && channels instanceof Array 
        ? channels.map((x, i) => (
          <div>
            {x} - 
            <Link to={`/c/${x}`} key={i}>
              <button>{x}</button>
            </Link>
          </div>
        )) 
        : "no channels"}
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
  const user = useUserAuth();
  const [channel, setChannel] = useState<any | undefined>(null)
  const [messages, setMessages] = useState<any | undefined>(null)
  const [error, setError] = useState<any | undefined>(null)
  const [message, setMessage] = useState<string>("")
  const channelRef = getRef(`/channels/${location.pathname.split("/")[2]}`)
  const messagesRef = getRef(`/channels/${location.pathname.split("/")[2]}/messages`)
  const newMessageRef = push(messagesRef)
  
  const sendMessage = (message: string) => {
    set(newMessageRef, {text: message, timestamp: new Date().valueOf(), name: user.email})
  }

  useEffect(() => {
    if (!user) {
      console.log(user)
      setError({error: "Not logged in"})
    } else {
      
      const unsubscribe = onValue(channelRef, (snapshot) => {
        console.log(snapshot)
        console.log(snapshot.val())
        setChannel(snapshot.val())
        setError(null)
      }, (error) => {
        console.error(error)
        setError(error)
      }, {
        onlyOnce: true
      })
      const mUnsubscribe = onValue(messagesRef, (snapshot) => {
        console.log(snapshot)
        const list: any = [];
        snapshot.forEach((childSnapshot) => {
          let data = {key: childSnapshot.key, ...childSnapshot.val()}
          list.push(data)
        }) 
        setMessages(list)
        setError(null)
      }, (error) => {
        console.error(error)
        setError(error)
      })
      return () => {
        unsubscribe()
        mUnsubscribe()
      }
    }
  }, [user])
  return (
    <>
      <Link to="/">
        <button>
          Home
        </button>
      </Link>
      <Link to="/channels">
        <button>
          Channels
        </button>
      </Link>
      <br/>
      {error ? <p>{error.code}</p> : null}
      {(channel !== null && channel !== undefined) && !error 
        ? 
        <>
          <h1>Channel: {channel.name}</h1>
          <br/>
          <Container fluid className="text-light bg-dark">
            <Stack gap={2}>
              {messages.map((m: any, i: number) => (
                <div key={i}>
                  ({new Date(new Date(m.timestamp).setMinutes(new Date(m.timestamp).getMinutes() - new Date(m.timestamp).getTimezoneOffset())).toUTCString()}) {m.name}: {m.text}
                  <br/>
                </div>
              ))} 
            </Stack>
          </Container>
          <form>
            <input type="text" name="message" id="message" onChange={(e) => setMessage(e.target.value)} />
            <button type="button" onClick={() => sendMessage(message)}>Send message</button>
          </form>
        </>
        : null
      }

    </>
  )
}

const App = () => {
  return (
    <>
      <AuthProvider>
        <DbProvider>
          <Router>
            <AppNavbar />
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