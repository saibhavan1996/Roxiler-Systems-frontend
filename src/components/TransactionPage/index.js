import {Component} from 'react'
import './index.css'

class TransactionPage extends Component {
  state = {
    month: 'March',
    searchText: '',
    transactions: [],
    currentPage: 1,
    totalItems: 0,
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
    priceRangeData: [],
  }

  componentDidMount() {
    this.fetchTransactions()
    this.fetchStatistics()
    this.fetchBarChartData()
  }

  fetchTransactions = async () => {
    const {month, searchText, currentPage} = this.state
    const response = await fetch(
      `http://localhost:3000/transactions?month=${month}&search=${searchText}&page=${currentPage}`,
    )
    const data = await response.json()
    this.setState({
      transactions: data.transactions,
      totalItems: data.totalItems,
    })
  }

  fetchStatistics = async () => {
    const {month} = this.state
    const response = await fetch(
      `http://localhost:3000/statistics?month=${month}`,
    )
    const data = await response.json()
    this.setState({
      totalSaleAmount: data.totalSaleAmount,
      totalSoldItems: data.totalSoldItems,
      totalNotSoldItems: data.totalNotSoldItems,
    })
  }

  fetchBarChartData = async () => {
    const {month} = this.state
    const response = await fetch(
      `http://localhost:3000/bar-chart?month=${month}`,
    )
    const data = await response.json()
    this.setState({priceRangeData: data})
  }

  handleMonthChange = e => {
    this.setState({month: e.target.value}, () => {
      this.fetchTransactions()
      this.fetchStatistics()
      this.fetchBarChartData()
    })
  }

  handleSearchChange = e => {
    this.setState({searchText: e.target.value})
  }

  handleSearchSubmit = () => {
    this.fetchTransactions()
  }

  handleNextPage = () => {
    const {currentPage} = this.state
    this.setState({currentPage: currentPage + 1}, () => {
      this.fetchTransactions()
    })
  }

  handlePrevPage = () => {
    const {currentPage} = this.state
    if (currentPage > 1) {
      this.setState({currentPage: currentPage - 1}, () => {
        this.fetchTransactions()
      })
    }
  }

  render() {
    const {
      month,
      searchText,
      transactions,
      currentPage,
      totalItems,
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
      priceRangeData,
    } = this.state

    return (
      <div className="transaction-page">
        <h1>Transactions</h1>
        <div className="filters">
          <label htmlFor="selectMonth">Select Month:</label>
          <select value={month} onChange={this.handleMonthChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
          </select>
          <input
            type="text"
            placeholder="Search Transaction"
            value={searchText}
            onChange={this.handleSearchChange}
          />
          <button type="submit" onClick={this.handleSearchSubmit}>
            Search
          </button>
        </div>

        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.dateOfSale}</td>
                  <td>{transaction.productTitle}</td>
                  <td>{transaction.productDescription}</td>
                  <td>{transaction.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button type="button" onClick={this.handlePrevPage}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button type="button" onClick={this.handleNextPage}>
              Next
            </button>
          </div>
        </div>

        <div className="statistics-box">
          <h2>Statistics</h2>
          <p>Total Sale Amount: {totalSaleAmount}</p>
          <p>Total Sold Items: {totalSoldItems}</p>
          <p>Total Not Sold Items: {totalNotSoldItems}</p>
        </div>

        <div className="bar-chart">
          <h2>Price Range Chart</h2>
          <div className="chart-container">
            {priceRangeData.map(range => (
              <div key={range.range} className="bar">
                <div className="bar-label">{range.range}</div>
                <div
                  className="bar-value"
                  style={{height: `${range.count * 10}px`}}
                >
                  {totalItems}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default TransactionPage
