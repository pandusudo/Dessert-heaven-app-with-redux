import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {Navbar, Nav, NavItem, NavDropdown, Form, FormControl, Button, Container} from 'react-bootstrap';
import './assets/css/bootstrap.min.css'
import './App.css';

import Layout from './components/Layout'
import Login from './components/Login'

class App extends Component {
  render () {
    return (
      <div className="container-fluid m-0 p-0 overflow-hidden">
        {/*<Navbars />*/}
        <Router>
          <Route path = {'/home'} component = {Layout} />
          <Route path = {'/'} component = {Login} />
        </Router>
        {/* <Body /> */}
      </div>
    )
  }
}

export default App;
