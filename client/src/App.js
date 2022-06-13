import React from "react";
import io from "socket.io-client";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
} from "react-router-dom";
import "./App.css";

class Home extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      error: props.error,
    }
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
        {this.state.user ? <p>Hello, {JSON.stringify(this.state.user)}</p> : <p>Hello, guest</p>}
        {this.state.error ? <p>{JSON.stringify(this.state.error)}</p> : <p>No error</p>}
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
        this.setData({...data, loggedIn: true})
      } else {
        this.setData(data)
      }
    })
    this.socket.on("login", (dataObject) => {
      const {timestamp, status, data} = dataObject;
      console.log(timestamp, status, data)
      if (status === "success") {
        this.setState({loggedIn: true})
        this.setData({...data, loggedIn: true})
      } else {
        this.SetData(data)
      }
    })
    this.socket.on("signout", (dataObject) => {
      const {timestamp, status, data} = dataObject;
      console.log(timestamp, status, data)
      if (status === "success") {
        this.setState({loggedIn: false})
        this.setData({user: null, loggedIn: false})
      } else {
        this.SetData(data)
      }
    })
    this.state = {
      loggedIn: props.loggedIn,
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
    this.socket.off("signout");
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
          {this.state.loggedIn === false ? <button type="button" onClick={() => this.sendLogin(this.state.email, this.state.password)}>Log in</button> : <button type="button" onClick={() => this.sendSignout()}>Log out</button>}
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
    }
  }

  setData = (data) => { 
    this.setState({...this.state, ...data});
  } /*{key: value}*/

  render() {
    let loginProps = {
      socket: this.socket,
      setData: this.setData,
      loggedIn: this.state.loggedIn, 
    };
    console.log(loginProps)
    const homeProps = {
      user: this.state.user, 
      error: this.state.error,
    };
    return (
      <React.Fragment>
        <Router>
          <Link to={"/"}>Home</Link>
          <br/>
          <Link to={"/login"}>Login</Link>
          <Routes>
            <Route path="/" element={<Home {...homeProps} />} /> 
            <Route path="/login" element={<Login {...loginProps} />}/>
            {/*
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} /> 
            */}
          </Routes>
        </Router>
      </React.Fragment> 
    )
  }
}
