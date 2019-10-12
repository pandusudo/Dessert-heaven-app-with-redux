import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'
import { Link } from 'react-router-dom'
import Product from './Product'
import Cart from './Cart'
import { connect } from 'react-redux'
import { categories } from '../Redux/Actions/Categories'

class Body extends Component {
  constructor(props) {
    super()
    this.state = {
      data: [],
      categories: [],
      cart: [],
      currentPage: 0,
      pages: 0,
      allData: 0,
      total: 0,
      amount: 0,
    }
    this.handleCheckout = this.handleCheckout.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
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
    this.setState({
      total: this.state.total + price
    })
  }

  handleChange(e){
    let val = e.target.value
    this.sortBy(val)
  }

  async previousPage(){
    if (this.state.currentPage > 0) {
      this.state.currentPage -= 6
    }
    await this.getAll()
  }

  nextPage(){
    this.state.currentPage += 6
    this.getAll()
  }

  handleSubmit(e){
    e.preventDefault()
    const data = new FormData(e.target)

    axios({
      method: 'post',
      url: 'http://localhost:3333/api/products',
      data: data,
      config: { headers: {'Content-Type': 'multipart/form-data', Authorization: localStorage.getItem('keyToken') }}
    })
    window.location.href = "http://localhost:3000/home";
  }

  sortBy(val){
    if (val === '') {
      this.getAll()
    }else {
      axios.get('http://localhost:3333/api/products?page='+this.state.currentPage+'&limit=6&sortBy='+val,{
        headers: {
          Authorization: localStorage.getItem('keyToken')
        }
      })
      .then(result => {
        this.setState({data: result.data.data})
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  handleCart(result) {
    this.state.amount += 1
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

  reduceCart(result) {
    this.state.amount -= 1
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

  handleCheckout(){
    this.state.cart.map((item, index) => {
      axios.post('http://localhost:3333/api/products/history', {
        product: item.name,
        price: item.price*item.qty,
        amount: item.qty
      } , {
        headers: {
          Authorization: localStorage.getItem('keyToken')
        }
      })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
    })
  }

  async removeCart(id){
    let state = [...this.state.cart]
    let index = state.map(el => el.id).indexOf(id)
    this.state.amount -= this.state.cart[index].qty
    this.state.total -= (this.state.cart[index].qty * this.state.cart[index].price)
    if (index !== -1) state.splice(index,1)
    this.setState({cart: state})
  }

  handleKeyPress(e){
    let val = e.target.value
    if(e.key === 'Enter'){
      this.search(val)
    }
  }

  search(val){
    axios.get('http://localhost:3333/api/products?page='+this.state.currentPage+'&limit=6&name='+val,{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    })
    .then(result => {
      this.setState({data: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  async getAll(){
    await axios.get('http://localhost:3333/api/products',{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    })
    .then(result => {
      this.setState({allData: result.data.count})
    })
    .catch(err => {
      console.log(err)
    })

    await axios.get('http://localhost:3333/api/products?page='+this.state.currentPage+'&limit=6',{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    })
    .then(result => {
      this.setState({data: result.data.data})
      // console.log(this.state.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  async getCategories(){
    await this.props.dispatch(categories())
    console.log(this.props.data.categories)
    this.setState({categories: this.props.data.categories})
    // axios.get('http://localhost:3333/api/categories',{
    //   headers: {
    //     Authorization: localStorage.getItem('keyToken')
    //   }
    // })
    // .then(result => {
    //   this.setState({categories: result.data.data})
    //   // console.log(result.data.data)
    // })
    // .catch(err => {
    //   console.log(err)
    // })

  }

  render() {
    var max = Math.ceil(this.state.allData / 6)
    console.log(this.state.data)
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
          <div className="row">
            <div className="col-md-12 ml-5 mt-4">
              <button className = "btn">
                <Link to="/history">
                  <span className="fas fa-history"></span>
                </Link>
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
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-2">
                <span className="input-group-btn">
                  <button type="button" className="btn btn-default btn-number" disabled={Math.ceil((this.state.currentPage / 6)+1) < 2} onClick={this.previousPage} data-type="minus" data-field="quant[1]">
                    <span className="fas fa-minus" />
                  </button>
                </span>
              </div>
              <div className="col-md-8">
                <input type="text" name="quant[1]" value={Math.ceil((this.state.currentPage / 6)+1)} className="form-control input-number" defaultValue={1} min={1} />
              </div>
              <div className="col-md-2">
                <span className="input-group-btn">
                  <button type="button" className="btn btn-default btn-number" disabled={Math.ceil((this.state.currentPage / 6)+1) == max} data-type="plus" data-field="quant[1]" onClick={this.nextPage}>
                    <span className="fas fa-plus" />
                  </button>
                </span>
              </div>
            </div>
          </div>
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
          {
            (this.state.cart.length) > 0 ? (
              <div className="row mt-2 ml-2">
                <button data-toggle="modal" data-target="#checkout" className = "btn btn-primary">
                  Checkout
                </button>
              </div>
            ) : (
              <div></div>
            )
          }
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


      <div
        className="modal fade"
        id="checkout"
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
                Checkout
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="form-group">
                  {
                    this.state.cart.map((item, index) => {
                      return (
                        <div className="row">
                          <div className="col-md-6">
                            {item.name}
                          </div>
                          <div className="col-md-3">
                            $ {item.price}
                          </div>
                          <div className="col-md-3">
                            {item.qty}
                          </div>
                        </div>
                      )
                    })
                  }
                  <div className="row mt-1">
                    <div className="col-md-6">
                      <strong>PPN 10%</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>$ {this.state.total * 0.1}</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>{this.state.amount}</strong>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <strong>Products</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>Total Price</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>Amount</strong>
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-6">
                      <strong></strong>
                    </div>
                    <div className="col-md-3">
                      <strong>$ {this.state.total + (this.state.total * 0.1)}</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>{this.state.amount}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  data-dismiss="modal">Close</button>
                <button type="button" onClick={this.handleCheckout} className="btn btn-primary">
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

const mapStateToProps = state => {
  return {
    data: state.categories
  }
}

export default connect (mapStateToProps)(Body)
