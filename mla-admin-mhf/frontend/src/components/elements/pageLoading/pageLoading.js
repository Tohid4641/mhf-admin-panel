import React, { Component } from 'react'
import './pageLoading.scss'

class PageLoading extends Component {
  render () {
    return (
      <div className='page-loading'>
        <i className='fa fa-spin fa-refresh page-loading-icon' />
      </div>
    )
  }
}

export default PageLoading
