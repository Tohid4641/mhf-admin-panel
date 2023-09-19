import React, { Component } from 'react'
import './defaultLoading.scss';

class DefaultLoading extends Component { 
  
    render() {
        return <i className="fa fa-spin fa-refresh initial_loading" />
    }
}

export default DefaultLoading;