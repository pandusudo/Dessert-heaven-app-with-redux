import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'

class Product extends Component {
  constructor(props){
    super(props)
    this.state = {
      categories: [],
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      description: this.props.description,
      id_category: this.props.category,
      image: "",
      qty: this.props.quantity,
      qtyInCart: 0
    }
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleChangeDesc = this.handleChangeDesc.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.checkSelected = this.checkSelected.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.getCategories = this.getCategories.bind(this)
    // console.log(this.props.allCategory)
  }

  componentDidMount(){
    this.getCategories()
  }

  getCategories(){
    axios.get('http://localhost:3333/api/categories',{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    })
    .then(result => {
      this.setState({categories: result.data.data})
      // console.log(result.data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleChangeName(e){
    let val = e.target.value
    this.setState({
      name: val
    })
  }

  handleChangeQuantity(e){
    let val = e.target.value
    this.setState({
      qty: val
    })
  }

  handleChangeDesc(e){
    let val = e.target.value
    this.setState({
      description: val
    })
  }

  handleChangePrice(e){
    let val = e.target.value
    this.setState({
      price: val
    })
  }

  handleUpdate(e){
    e.preventDefault()
    const data = new FormData(e.target)

    let url = `http://localhost:3333/api/products/${this.props.id}`

    axios({
      method: 'put',
      url: url,
      data: data,
      config: { headers: {'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('keyToken') }}
    })

    window.location.href = "http://localhost:3000/home";
  }

  async addToCart(){
    console.log(this.state.name)
    if(this.state.qtyInCart > 0){
      this.state.qtyInCart +=1
    } else {
      await this.setState({
        id: this.props.id,
        qtyInCart: 1,
        name: this.props.name,
        price: this.props.price,
        image: this.props.image,
        id_category: this.props.category
      })
    }
    // console.log(this.state)
    await this.props.handleCart(this.state)
    this.props.handleTotal(this.props.price)
  }

  checkSelected(id){
    if(this.props.id === id){
      return "selected"
    }
  }

  handleDelete(e){
    e.preventDefault()

    axios.delete(`http://localhost:3333/api/products/${this.props.id}`, {crossdomain: true})
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

    window.location.href = "http://localhost:3000/home";
  }

  render(){
    console.log(this.state)
    return(
      <div className = "col-sm-4">
        <div className="card mr-5" style={{width: '18rem'}}>
          <div className = "card-img overflow-hidden" style={{height: '10rem'}}>
            <img
              src={"http://localhost:3333/" + this.props.image}
              className="card-img-top"
              alt="image of food"
              />
          </div>
          <div className="card-body">
            <h5 className="card-title">
              {this.props.name}
            </h5>
            <p className="card-text">
              $ {this.props.price}
            </p>
            <div className="row">
              <div className="col-md-6">
                <a href="#" className="btn btn-primary" onClick = {this.addToCart}>
                  Add to cart
                </a>
              </div>
              <div className="col-md-6">
                <button data-toggle="modal" data-target={"#deleteModal-"+this.props.id} className = "btn btn-danger">
                  <span className="far fa-trash-alt"></span>
                </button>
                &nbsp;
                <button data-toggle="modal" data-target={"#editModal-"+this.props.id} className = "btn btn-primary">
                  <span className="fa fa-edit"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id={"deleteModal-"+this.props.id}
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
                  Remove Product
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={this.handleDelete}>
              <div className="modal-body">
                <p>
                  Are You Sure you want to delete this product?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>



        <div
          className="modal fade"
          id={"editModal-"+this.props.id}
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
                  Edit Product
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={this.handleUpdate}>
                <div className="modal-body">
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      className="col-form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      onChange = {this.handleChangeName}
                      value={this.state.name} />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="price"
                      className="col-form-label">Price:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      onChange = {this.handleChangePrice}
                      value={this.state.price} />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="count"
                      className="col-form-label">Quantity:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="count"
                      onChange = {this.handleChangeQuantity}
                      value={this.state.qty} />
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
                      name="description"
                      onChange = {this.handleChangeDesc}
                      value={this.state.description} />
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

export default Product
