import { Component } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import UserContext from "./UserContext";
import ContextTester from "./ContextTester";
import NestedContextTest from "./NestedContextTest";

class SocketTest extends Component {
  state: { status: any, socket: Socket };

  socket: Socket;

  constructor(props: any) {
    super(props);
    this.socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
      transports: ["websocket"],
    })
    console.log("connecting to socket")
    console.log(this.socket)
    this.socket =  this.socket.connect();
    this.socket.on("connect", () => {
      console.log("connected");
      this.setState({ status: "connected" });
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected");
      this.setState({ status: "disconnected" });
    })
    this.state = {
      status: "disconnected",
      socket: this.socket
    };
  }
  
  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return <>{this.state.status}</>;
  }
}

export class Test extends Component {
  state = { msg: null };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/test")
      .then(res => res.text())
      .then(msg => {
        this.setState({ msg });
      })
      .catch(err => {
        throw err;
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Chat App</h1>
        <p>Server message: {this.state.msg || "loading..."}</p>
      </div>
    );
  }
}

export default function App() {
  var user = "😁"; //TODO Put auth and user details here

  return (
    <>
      {/* Provides to all children */}
      <UserContext.Provider value={user}>
        <Test />
        <SocketTest />
        <ContextTester />
        <NestedContextTest />
        {/*<Router>
          <Routes>
          <Route path="/" element={<Test />} />
          </Routes>
          </Router>
        */}
      </UserContext.Provider>
    </>
  );
}
