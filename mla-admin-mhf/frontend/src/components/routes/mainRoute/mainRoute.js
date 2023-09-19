import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import './mainRoute.scss'
import MainRoutes from '../../application/appRoutes/appRoutes'

class MainRoute extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    console.log('Main Router container')
  }

  render () {
    return this.props.config.maintenance ? (
      <div className='maintenance'>
        <Router>
          <div className='m_header'>Header</div>
        </Router>
        <div className='m_container'>
          <h1>Sorry for the inconvenience. We’ll be back soon!</h1>
        </div>
      </div>
    ) : (
      <Router>
        {
          <Route
            render={props => {
              return <MainRoutes {...props} />
            }}
          />
        }
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MainRoute)
