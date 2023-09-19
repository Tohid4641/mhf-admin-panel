import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import MainRoute from './components/routes/mainRoute/mainRoute'

import { updateConfig } from './store/actions/auth'

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = { appconfig: null, readConfigureDone: false }
  }

  componentDidMount () {
    console.log('main')
    this.getConfig()
  }

  getConfig = () => {
    var thisView = this
    axios
      .get('conf/appconfig.json')
      .then(function (res) {
        var appconfig = res.data
        thisView.props.updatingConfig(appconfig)

        thisView.setState({ appconfig, readConfigureDone: true })
      })
      .catch(function (res) {
        console.log(res)
        console.log('An error occurred config')
      })
  }

  getRoute = route => {
    if (route === 'main') return <MainRoute />
    return <MainRoute />
  }

  render () {
    return this.state.appconfig ? (
      <div className='app'>{this.getRoute(this.state.appconfig.source)}</div>
    ) : (
      <span></span>
    ) //Dummy return instead of empty in render
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({
  updatingConfig (data) {
    dispatch(updateConfig(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
