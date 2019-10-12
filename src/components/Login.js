import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'

class Login extends Component{
  constructor(props){
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.setSession = this.setSession.bind(this)
  }

  handleSubmit(e){
    e.preventDefault()
    const data = new FormData(e.target)
    console.log(e)

    axios({
      method: 'post',
      url: 'http://localhost:3333/api/users/login',
      data: data,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(res => {
      localStorage.setItem('keyToken', `Bearer ${res.data.token}`)
      window.location.href = "http://localhost:3000/home"
    })
    .catch(err => {
      alert('username or password incorrect')
    })
  }

  handleSignUp(e){
    e.preventDefault()
    const data = new FormData(e.target)
    console.log(e)

    fetch('http://localhost:3333/api/users/register', {
      method: 'POST',
      body: data,
    })
    .then(res => {
      if (res.status === 200) {
        window.location.href = "http://localhost:3000/login"
      } else if (res.status === 500) {
        alert("username is already exist")
      }
    })
  }

  // setSession(){
  //   console.log()
  // }



  render () {
    return (
      <div className="row">
        <div className="col-md-4">
        </div>
        <div className="col-md-4">
          <div className="card m-5">
            <article className="card-body">
              <a
                href
                className="float-right btn btn-outline-primary"
                data-target="#signUpModal"
                data-toggle="modal">
                Sign up
              </a>
              <h4 className="card-title mb-4 mt-1">
                Sign in
              </h4>
              <form onSubmit = {this.handleSubmit}>
                <div className="form-group">
                  <label>
                    Username
                  </label>
                  <input
                    name = "username"
                    className="form-control"
                    placeholder="Username"
                    type="text" />
                </div>
                <div className="form-group">
                  <label>
                    password
                  </label>
                  <input
                    name="password"
                    className="form-control"
                    placeholder="******"
                    type="password" />
                </div>
                <div className="form-group">
                  <div className="checkbox">
                    <label> <input type="checkbox" /> Save password </label>
                  </div>
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"> Login</button>
                </div>
              </form>
            </article>
          </div>
        </div>
        <div className="col-md-4">
        </div>


        <div
          className="modal fade"
          id="signUpModal"
          tabindex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="exampleModalLabel">
                  Register
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={this.handleSignUp}>
                <div className="modal-body">
                  <div className="form-group">
                    <label
                      htmlFor="username"
                      className="col-form-label">Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"/>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="password"
                      className="col-form-label">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-warning"
                    data-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
