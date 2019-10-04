import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'
import Product from './Product'
import Cart from './Cart'

class Body extends Component {
  constructor(props) {
    super()
    this.state = {
      pages: 0,
      data: [],
      categories: [],
      cart: [],
      total: 0,
    }
    this.removeCart = this.removeCart.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.sortBy = this.sortBy.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.search = this.search.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.calculateTotal = this.calculateTotal.bind(this)
    this.handleCart = this.handleCart.bind(this)
    this.reduceCart = this.reduceCart.bind(this)
  }

  componentDidMount() {
    this.getAll()
    this.getCategories()
  }

  calculateTotal(price) {
    // console.log(this.state.cart)
    this.setState({
      total: this.state.total + price
    })
  }

  handleChange(e){
    let val = e.target.value
    this.sortBy(val)
  }

  handleSubmit(e){
    console.log(e)
    // alert(e.target)
    e.preventDefault()
    const data = new FormData(e.target)

    fetch('http://localhost:3333/api/products', {
      method: 'POST',
      body: data,
    })
    window.location.href = "http://localhost:3000/home";
  }

  sortBy(val){
    if (val === '') {
      this.getAll()
    }else {
      axios.get('http://localhost:3333/api/products?sortBy='+val)
      .then(result => {
        this.setState({data: result.data.data})
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  handleCart(result) {
    this.setState( state => {
      const cart = state.cart
      let inCart = false
      cart.forEach(item => {
        if (item.name === result.name) {
          inCart = true
          item.qty += 1
        }
      })
      if (!inCart) {
        cart.push({...result, qty: 1})
      }
      return (cart)
    })
  }

  pagination = () => {
    let pagination = []

    // Outer loop to create parent
    for (let i = 0; i < this.state.pages; i++) {
      pagination.push(<li className="page-item"><a className="page-link" onClick={this.getAll(i)}>{i+1}</a></li>)
    }
    return pagination
  }

  reduceCart(result) {
    // console.log(this.state.cart)
    this.setState(state => {
      const cart = state.cart
      cart.forEach(item => {
        if (item.name === result.name) {
          item.qty -= 1
        }
      })
      return (cart)
    })
  }

  async removeCart(id){
    console.log(this.state.cart)
    let state = [...this.state.cart]
    let index = state.map(el => el.id).indexOf(id)
    if (index !== -1) state.splice(index,1)
    this.setState({cart: state})
    // if (this.state.cart.qty < 1) {
    //   await this.state.cart.splice(,1)
    // }
    console.log(this.state.cart)
  }

  handleKeyPress(e){
    let val = e.target.value
    if(e.key === 'Enter'){
      this.search(val)
    }
  }

  search(val){
    axios.get('http://localhost:3333/api/products?name='+val)
    .then(result => {
      this.setState({data: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getAll(page = 0){
    const limit = 999
    let pageCount = Math.ceil(this.state.data.count/limit)
    this.setState({pages: pageCount})
    axios.get('http://localhost:3333/api/products?page='+page+'&limit='+limit)
    .then(result => {
      this.setState({data: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getCategories(){
    axios.get('http://localhost:3333/api/categories')
    .then(result => {
      this.setState({categories: result.data.data})
      // console.log(result.data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return(
      <div className="row" >
        <div className = "col-md-1 pl-0 ml-0 border border-light border-top-0 shadow" style={{height: "700px"}}>
          <div className="row">
            <div className="col-md-12 ml-5 mt-4">
              <button data-toggle="modal" data-target="#addModal" className = "btn">
                <span className="fas fa-plus"></span>
              </button>
            </div>
          </div>
        </div>
        <div className = "col-md-8 p-4 m-0" style={{height: "700px", overflowX: "hidden", overflowY: "auto"}}>
          <div className="row m-5">
            <div className=" col-md-4">
              Search product by name : <input className="form-control" type="text" name="name" onKeyPress={this.handleKeyPress} />
          </div>
          <div className=" col-md-4">
            Sort product by :
            <select className="form-control" onChange={this.handleChange}>
              <option value="">--SELECT--</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
        <div className="row m-1 d-flex">
          {
            this.state.data.length > 0 ? (
              this.state.data.map((item, index) => {
                return (
                  <Product
                    key={index}
                    allCategory = {this.state.categories}
                    category={item.id_category}
                    quantity={item.count}
                    description={item.description}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image = {item.image}
                    handleTotal = {this.calculateTotal}
                    handleCart = {this.handleCart} />
                )
              })
            ) : (
              <div className= "jumbotron md-12">data is empty</div>
            )
          }
        </div>
        <div className="row">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
          {
            this.pagination
          }
            </ul>
          </nav>
        </div>
      </div>
      <div className = "col-md-3 p-4 m-0 border border-light border-top-0 shadow">
        <div className="my-yellow rounded mb-5" style={{height: "500px", overflowY: "auto", overflowX: "hidden"}}>
          {
            this.state.cart.length > 0 ? (
              this.state.cart.map((product, index) => {
                return (
                  <Cart
                    key = {index}
                    id = {product.id}
                    name = {product.name}
                    price = {product.price}
                    image = {product.image}
                    handleRemove = {this.removeCart}
                    quantity = {product.qty}
                    handleTotal = {this.calculateTotal}
                    handleCart = {this.handleCart}
                    reduceCart={this.reduceCart} />
                )
              })
            ) : (
              <div className="jumbotron">
                <h1>
                  your cart is empty
                </h1>
              </div>
            )
          }
        </div>
        <div>
          <strong>
            Total Price: $ {this.state.total}
          </strong>
        </div>
      </div>


      <div
        className="modal fade"
        id="addModal"
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
                Add Product
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label
                    htmlFor="name"
                    className="col-form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name" />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="price"
                    className="col-form-label">Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price" />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="count"
                    className="col-form-label">Quantity:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="count" />
                </div>
                <div>
                  <label
                    htmlFor="id_category"
                    className="col-form-label">category:</label>
                  <select id="category" name="id_category" className="form-control">
                    <option value="">--SELECT--</option>
                    {
                      this.state.categories.map((item, index) => {
                        return (
                          <option value={item.id}>{item.name_category}</option>
                        )
                      })
                    }
                  </select>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="image"
                    className="col-form-label">Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image" />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="description"
                    className="col-form-label">Description:</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description" />
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


export default Body
