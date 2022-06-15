import { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

export default class App extends Component {
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
      <Router>
        <div className="App">
          <h1>Chat App</h1>
          <p>Server message: {this.state.msg || "loading..."}</p>
        </div>
      </Router>
    );
  }
}
