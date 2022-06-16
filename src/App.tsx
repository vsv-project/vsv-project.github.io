import { Component } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import UserContext from "./UserContext";
import ContextTester from "./ContextTester";
import NestedContextTest from "./NestedContextTest";

class SocketTest extends Component {
  state: { status: any };
  socket: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      status: "disconnected",
    };
    this.socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {
      transports: ["websocket"],
    }).connect();
    this.socket.on("connection", (socket: Socket) => {
      console.log("connected");
      this.setState({ status: "connected" });
      socket.on("disconnect", () => {
        console.log("disconnected");
        this.setState({ status: "disconnected" });
      });
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  render() {
    return <>{this.state.status}</>;
  }
}

class Test extends Component {
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
