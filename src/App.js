import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

class SocketTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: "disconnected"
    }
    this.socket = io(process.env.REACT_APP_API_ENDPOINT + "/wss", {transports: ["websocket"]}).connect();
    this.socket.on("connection", (socket) => {
      console.log("connected")
      this.setState({status: "connected"})
      socket.on("disconnect", () => {
        console.log("disconnected")
        this.setState({status: "disconnected"})
      })
    })
  }
  componentWillUnmount() {
    this.socket.disconnect()
  }
  render() {
    return (
      <React.Fragment>
        {this.state.status}
      </React.Fragment>
    )
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

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
      <Test />
      <SocketTest />

        {/*<Router>
          <Routes>
            <Route path="/" element={<Test />} />
          </Routes>
        </Router>
        */}
      </React.Fragment>
    );
  }
}
