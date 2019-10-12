import React, { Component } from 'react'
import axios from 'axios'
import '../assets/css/bootstrap.min.css'
import '../assets/css/fontawesome.min.css'
import '../App.css'
import Product from './Product'
import Cart from './Cart'
import { Line } from 'react-chartjs-2'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'

class Graph extends Component{
  constructor(props){
    super()
    this.state = ({
      history: [],
      dailyIncome: [],
      weeklyIncome: [],
      monthlyIncome: [],
      annualIncome: [],
      income: [],
      amount: 0,
      data: {},
      orders: [],
      totalOrders: 0
    })
    this.handleLineChart = this.handleLineChart.bind(this)
    this.getDailyIncome = this.getDailyIncome.bind(this)
    this.getAnnualIncome = this.getAnnualIncome.bind(this)
    this.getWeeklyIncome = this.getWeeklyIncome.bind(this)
    this.drawGraph = this.drawGraph.bind(this)
    this.getHistory = this.getHistory.bind(this)
  }

  async componentDidMount(){
    await this.getDailyIncome()
    await this.getMonthlyIncome()
    await this.getAnnualIncome()
    await this.getWeeklyIncome()
    await this.getHistory()
    await this.drawGraph("daily")
  }

  getHistory(){
    axios.get('http://localhost:3333/api/products/history',{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    }).
    then( result => {
      this.setState({history: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getDailyIncome(){
    axios.get('http://localhost:3333/api/products/dailyIncome')
    .then(result => {
      this.setState({dailyIncome: result.data.data})
      console.log(result.data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  getMonthlyIncome(){
    axios.get('http://localhost:3333/api/products/monthlyIncome')
    .then(result => {
      this.setState({monthlyIncome: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getAnnualIncome(){
    axios.get('http://localhost:3333/api/products/annualIncome')
    .then(result => {
      this.setState({annualIncome: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getWeeklyIncome(){
    axios.get('http://localhost:3333/api/products/weeklyIncome')
    .then(result => {
      this.setState({weeklyIncome: result.data.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleLineChart(e){
    var val = e.target.value
    this.drawGraph(val)
  }

  drawGraph(val){
    if (val == "daily") {
      var labels = []
      var daily = [0]
      var dailyAmount = []
      var i = 0
      this.state.dailyIncome.map(item => {
        daily.push(item.INCOME)
        dailyAmount.push(item.AMOUNT)
        i++
        console.log(i)
      })

      console.log(daily)
      const dataChart = {
        labels: ['',''],
        datasets: [
          {
            label: 'This Day',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#ff7979',
            borderColor: '#ff7979',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ff7979',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ff7979',
            pointHoverBorderColor: '#ff7979',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, daily[daily.length -1]]
          },
          {
            label: 'Yesterday',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#7ed6df',
            borderColor: '#7ed6df',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#7ed6df',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#7ed6df',
            pointHoverBorderColor: '#7ed6df',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, daily[daily.length -2]]
          }
        ]
      }
      this.setState({data: dataChart})
    } else if (val == "weekly") {
      var weekly = [0]
      var lastDate = []
      var dayNum = []
      this.state.weeklyIncome.map(item => {
        weekly.push(item.INCOME)
        lastDate.push(item.date_created)
      })

      lastDate.map(date => {
        dayNum.push(new Date(date).getDay())
      })

      var zeros = []

      if (dayNum[dayNum.length - 1] - dayNum[dayNum.length - 2] > 1 && daily[daily.length - 2] != 0) {
        for (var i = 1; i < dayNum[dayNum.length - 1] - dayNum[dayNum.length - 2]; i++) {
          zeros.push(0)
        }
        daily.splice(daily.length - 2, 0, zeros)
      }

      console.log(daily)


      var thisDateTime = new Date().getTime()
      var lastDateTime = new Date(lastDate[lastDate.length - 1]).getTime()
      var diff = lastDateTime - thisDateTime
      var day = diff / (1000 * 3600 * 24)
      // if (Math.ceil(day) > 0){
      //   for (var i = 0; i < array.length; i++) {
      //     array[i]
      //   }
      // }

      const dataChart = {
        labels: ['','','','','','',''],
        datasets: [
          {
            label: 'This Week',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#ff7979',
            borderColor: '#ff7979',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ff7979',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ff7979',
            pointHoverBorderColor: '#ff7979',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: weekly.slice(Math.max(weekly.length - 7, 0))
          },
          {
            label: 'Last Week',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#7ed6df',
            borderColor: '#7ed6df',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#7ed6df',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#7ed6df',
            pointHoverBorderColor: '#7ed6df',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: weekly.slice(Math.max(weekly.length - 14, 0)).slice(0, 7)
          }
        ]
      }
      this.setState({data: dataChart})
    } else if (val == "monthly") {
      var monthly = [0]
      this.state.monthlyIncome.map(item => {
        monthly.push(item.INCOME)
      })

      const dataChart = {
        labels: ['','','',''],
        datasets: [
          {
            label: 'This Month',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#ff7979',
            borderColor: '#ff7979',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ff7979',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ff7979',
            pointHoverBorderColor: '#ff7979',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: monthly.slice(Math.max(monthly.length - 4, 0))
          },
          {
            label: 'Last Month',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#7ed6df',
            borderColor: '#7ed6df',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#7ed6df',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#7ed6df',
            pointHoverBorderColor: '#7ed6df',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: monthly.slice(Math.max(monthly.length - 8, 0)).slice(0, 4)
          }
        ]
      }
      this.setState({data: dataChart})
    } else if (val == "annual") {
      var annual = [0]
      this.state.annualIncome.map(item => {
        annual.push(item.INCOME)
      })

      const dataChart = {
        labels: ['','','','','','','','','','','',''],
        datasets: [
          {
            label: 'This Year',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#ff7979',
            borderColor: '#ff7979',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ff7979',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ff7979',
            pointHoverBorderColor: '#ff7979',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: annual.slice(Math.max(annual.length - 12, 0))
          },
          {
            label: 'Last Year',
            fill: false,
            lineTension: 0.3,
            backgroundColor: '#7ed6df',
            borderColor: '#7ed6df',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#7ed6df',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#7ed6df',
            pointHoverBorderColor: '#7ed6df',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: annual.slice(Math.max(annual.length - 24, 0)).slice(0, 12)
          }
        ]
      }
      this.setState({data: dataChart})
    }
  }

  render(){
    // console.log(this.state.dailyIncome)
    var daily = [0]
    var dailyAmount = []
    this.state.dailyIncome.map(item => {
      daily.push(item.INCOME)
      dailyAmount.push(item.AMOUNT)
    })

    var weekly = [0]
    this.state.weeklyIncome.map(item => {
      weekly.push(item.INCOME)
    })

    var annual = [0]
    this.state.annualIncome.map(item => {
      annual.push(item.INCOME)
    })

    var weekly = [0]
    var lastDate = []
    var dayNum = []
    this.state.weeklyIncome.map(item => {
      weekly.push(item.INCOME)
      lastDate.push(item.date_created)
    })

    lastDate.map(date => {
      dayNum.push(new Date(date).getDay())
    })

    console.log(dayNum)
    console.log(lastDate)

    return(
      <div className="row" >
        <div className = "col-md-1 pl-0 ml-0 border border-light border-top-0 shadow" style={{height: "700px"}}>
          <div className="row">
            <div className="col-md-12 ml-5 mt-4">
              <button data-toggle="modal" data-target="#addModal" className = "btn">
                <Link to="/home">
                  <span className="fas fa-long-arrow-alt-left"></span>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className = "col-md-11 p-4 m-0" style={{height: "700px", overflowX: "hidden", overflowY: "scroll"}}>
          <div className="row m-5">
            <div className="col-md-4">
              <div className="card bg-primary text-white text-center p-3">
                <blockquote className="blockquote mb-0">
                  <p>
                    Today's Income
                  </p>
                  <h1>
                    $ {daily[daily.length - 1]}
                  </h1>
                  <footer className="text-white">
                    {Math.round(((daily[daily.length - 1] - daily[daily.length - 2]) / daily[daily.length - 2]) * 100)} %
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className=" col-md-4">
              <div className="card bg-warning text-white text-center p-3">
                <blockquote className="blockquote mb-0">
                  <p>
                    Today's Orders
                  </p>
                  <h1>
                    {dailyAmount[dailyAmount.length-1]}
                  </h1>
                  <footer className="text-white">
                    {Math.round(((dailyAmount[dailyAmount.length - 1] - dailyAmount[dailyAmount.length - 2]) / dailyAmount[dailyAmount.length - 2]) * 100)} %
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className=" col-md-4">
              <div className="card bg-danger text-white text-center p-3">
                <blockquote className="blockquote mb-0">
                  <p>
                    This Year's Income
                  </p>
                  <h1>
                    $ {annual[annual.length - 1]}
                  </h1>
                  <footer className="blockquote-footer text-white">
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <select onChange={this.handleLineChart}>
                    <option selected value="">-- Interval --</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                  <Line ref="chart" data={this.state.data} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.history.map((item, index) => {
                          return(
                            <tr>
                              <th> {item.date_created}</th>
                              <td>{item.product}</td>
                              <td>$ {item.price}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Graph
