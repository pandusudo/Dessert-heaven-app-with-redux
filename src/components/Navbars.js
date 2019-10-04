import React, { Component } from 'react'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'

class Navbars extends Component {
  render() {
    return (
      <div className = "row">
        <div className = "col-md-1 p-0 mr-0">
          <nav className="navbar navbar-custom">
            <button
              className="navbar-toggler navbar-toggler-right custom-toggler m-auto"
              type="button"
              data-toggle="collapse"
              data-target="#navbarToggleExternalContent"
              aria-controls="navbarToggleExternalContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          </nav>
        </div>
        <div className = "col-md-8 p-0 mr-0">
          <nav className="navbar navbar-custom">
            <p className = "navbar-brand m-auto">
              Dessert Heaven
            </p>
            <button type="button" className="btn ">
              <i className="fas fa-search"></i>
            </button>
          </nav>
        </div>
        <div className = "col-md-3 p-0 ml-0">
          <nav className="navbar navbar-custom">
            <i className = "navbar-brand">
              Cart
            </i>
          </nav>
        </div>
      </div>
    )
  }
}

export default Navbars
