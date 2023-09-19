import React, { Component } from 'react'
// import Footer from './Footer';
import Header from './Header'

import Sidebar from './Sidebar'

class Base extends Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleactive: false
    }
    this.updateValue = this.updateValue.bind(this)
  }
  updateValue (value) {
    this.setState(prevState => ({
      toggleactive: !prevState.toggleactive
    }))
  }
  render () {
    // console.log(this.props);

    return (
      <div
        className={this.state.toggleactive ? 'wrapper  slide-menu' : 'wrapper'}
      >
        <div className='container-fluid'>
          <div className='row'>
            <Sidebar />
            <div className='content'>
              <Header
                updateParent={this.updateValue}
                match={this.props.match}
                location={this.props.location}
                history={this.props.history}
              />
              <div className='grid grid-cols-12 gap-6'>
                {this.props.children}
              </div>
              {/* <Footer /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Base
