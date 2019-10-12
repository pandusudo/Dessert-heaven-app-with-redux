import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'

class Cart extends Component{
  constructor(props){
    super(props)
    this.state = {
      id: this.props.id,
      qty: this.props.quantity,
      name: this.props.name,
      price: this.props.price,
      image: this.props.image
    }
    this.addToCart = this.addToCart.bind(this)
    this.reduceQuantity = this.reduceQuantity.bind(this)
    this.removeCart = this.removeCart.bind(this)
  }

  async addToCart(){
    if(this.props.quantity > 0){
      await this.setState({
        qty: this.props.quantity + 1,
        name: this.props.name,
        id: this.props.id,
        price: this.props.price,
        image: this.props.image
      })
    } else {
      await this.setState({
        qty: 1,
        id: this.props.id,
        name: this.props.name,
        price: this.props.price,
        image: this.props.image
      })
    }
    await this.props.handleTotal(this.state.price)
    await this.props.handleCart(this.state)
  }

  async removeCart(){
    await this.setState({
      qty: 0,
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      image: this.props.image
    })
    await this.props.handleRemove(this.props.id)
    // await this.props.handleTotal(0)
  }

  async reduceQuantity(){
    // this.state.qty -= 1
    await this.setState({
      qty: this.props.quantity - 1,
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      image: this.props.image
    })
    await this.props.handleTotal(-this.state.price)
    await this.props.reduceCart(this.state)
    if (this.props.quantity < 1) {
      await this.props.handleRemove(this.props.id)
    }
  }

  render () {
    return (
      <div>
      {
        this.props.quantity > 0 ? (
          <div className="row m-2 bg-light cart-list">
            <div className="col-md-4 d-flex bg-dark cart-container p-3">
              <img src={"http://localhost:3333/" + this.props.image} className="img-cart fit-image " />
            </div>
            <div className="col-md-8 p-3">
              <div className="row mb-5">
                <div className="col-md-12">
                  <h5>{this.props.name}</h5>
                </div>
                <div className="col-md-12">
                  <p>Price : $ {this.props.price}</p>
                </div>
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-btn">
                      <button type="button" className="btn btn-default btn-number" disabled={this.props.quantity < 1} onClick={this.reduceQuantity} data-type="minus" data-field="quant[1]">
                        <span className="fas fa-minus" />
                      </button>
                    </span>
                    <input type="text" name="quant[1]" value = {this.props.quantity} className="form-control input-number" defaultValue={1} min={1} max={10} />
                    <span className="input-group-btn">
                      <button type="button" className="btn btn-default btn-number" data-type="plus" data-field="quant[1]" onClick={this.addToCart}>
                        <span className="fas fa-plus" />
                      </button>
                    </span>
                  </div>
                </div>
                <div className="col-md-12">
                  <button className="btn btn-danger m-4" onClick={this.removeCart}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )
      }
    </div>
    )
  }
}

export default Cart
