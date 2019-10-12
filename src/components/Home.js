import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Body from './Body'
import Navbars from './Navbars'

class Home extends Component{
  render () {
    return (
      <>
      <Navbars />
      <Body />
      </>
    )
  }
}

export default Home
