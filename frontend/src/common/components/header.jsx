import React, { Component } from "react";
import { browserHistory, Link } from "react-router"

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.searchType = React.createRef();
    this.handleSearch = this.handleSearch.bind(this);
  }
  handleSearch() {
    const value = this.searchInput.value;
    switch (this.searchType.value) {
      case 'address':
        if(value !== ''){
          browserHistory.push(`/account/${value}`);
          this.searchInput.value = '';
        }
        break;
      case 'block':
        browserHistory.push(`/blocks/${value}`);
        this.searchInput.value = '';
        break;
      case 'transaction':
        browserHistory.push(`/txs/${value}`);
        this.searchInput.value = '';
        break;
      default:
        break;
    }
  }
  handleEnterKey(e) {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }
  render() {
    return (
      <div className="theta-header">
        <Link to="/" className="theta-logo"></Link>
        <div className="nav">
          <Link to="/blocks">Blocks</Link>
          <Link to="/txs">Transactions</Link>
        </div>
        <div className="flex-spacer"></div>
        <div className="nav-search">
          <input type="text" className="search-input" placeholder="Search" ref={input => this.searchInput = input} onKeyPress={e => this.handleEnterKey(e)} />
          <div className="search-select">
            <select ref={option => this.searchType = option}>
              <option value="address">Address</option>
              <option value="block">Block Height</option>
              <option value="transaction">Transaction</option>
            </select>
          </div>
          <div className="search-button" onClick={this.handleSearch}>
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path fill="none" d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
								c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
								c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
                s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}