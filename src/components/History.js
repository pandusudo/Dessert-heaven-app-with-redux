import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Graph from './Graph'
import Navbars from './Navbars'

class Home extends Component{
  render () {
    return (
      <>
      <Navbars />
      <Graph />
      </>
    )
  }
}

export default Home
