import React from "react";
import io from "socket.io-client";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
} from "react-router-dom";
import "./App.css";

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props)
    this.setData = props.setData;
    this.socket = props.socket;
    this.socket.on("signup", (dataObject) => {
      const {timestamp, status, data} = dataObject;
      console.log(timestamp, status, data)
      if (status === "success") {
        this.setState({loggedIn: true})
        this.setData(data)
      } else {
        this.SetData(data)
      }
    })
    this.socket.on("login", (data) => {
      const {timestamp, status, dataObject} = data;
      console.log(timestamp, status, dataObject)
      if (status === "success") {
        this.setState({loggedIn: true})
        this.setData(dataObject)
      } else {
        this.SetData(dataObject)
      }
    })
    this.socket.on("signout", (data) => {
      const {timestamp, status, dataObject} = data;
      console.log(timestamp, status, dataObject)
      if (status === "success") {
        this.setState({loggedIn: false})
        this.setData({user: null})
      } else {
        this.SetData(dataObject)
      }
    })
    this.state = {
      loggedIn: false,
      email: "",
      password: "",
    }
  }
  onChangeEvent = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }
  componentWillUnmount() {
    this.socket.off("signup");
    this.socket.off("login");
  }
  sendSignUp = (email, password) => {
    this.socket.emit("signup", {email, password});
  }
  sendLogin = (email, password) => {
    this.socket.emit("login", {email, password});
  }
  sendSignout = () => {
    this.socket.emit("signout");
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form>
          <label>Email:</label>
          <input type="text" name="email" placeholder="email" onChange={(event) => this.onChangeEvent(event)} />
          <label>Password:</label>
          <input type="password" name="password" placeholder="password" onChange={(event) => this.onChangeEvent(event)} />
          <button type="button" onClick={() => this.sendSignUp(this.state.email, this.state.password)}>Sign up</button>
          {<button>Log in</button>}
        </form>
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io.connect("/api");
    this.socket.on("connect", () => {
      console.log("connected");
    })
    this.state = {
      user: null,
      error: null,
      loggedIn: false,
      loggedOut: false,
    }
  }

  setData = (data  ) => { 
    this.setState({[Object.keys(data)[0]]: Object.values(data)[0]});
  } /*{key: value}*/

  render() {
    let loginProps = {
      socket: this.socket,
      setData: this.setData 
    };
    console.log(loginProps)
    const homeProps = {
      user: this.state.user, 
      error: this.state.error,
    };
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home {...homeProps} />} /> 
          <Route path="/login" element={<Login {...loginProps} />}/>
          {/*
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
          */}
        </Routes>
      </Router>
    )
  }
}
