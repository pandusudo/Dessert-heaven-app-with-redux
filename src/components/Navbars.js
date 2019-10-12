import React, { Component } from 'react'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'

class Navbars extends Component {
  constructor(props){
    super(props)
    this.state = {}
    this.handleLogOut = this.handleLogOut.bind(this)
  }

  handleLogOut(){
    localStorage.removeItem("keyToken")
    window.location.href = "http://localhost:3000"
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-custom">
          <a className="navbar-brand ml-4">Dessert Heaven</a>
          <form className="form-inline">
            <button
              className="btn btn-outline-dark my-2 my-sm-0"
              type="button"
              onClick={this.handleLogOut}>Log out</button>
          </form>
        </nav>
      </div>
    )
  }
}

export default Navbars
