import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import * as Storage from '../services/localstorage'
import { connect } from 'react-redux'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'

import { authenticate, updateCurrentLanguage } from '../../store/actions/auth'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggleactive: false,
      defaultValue: 1
    }
    this.togglebutton = this.togglebutton.bind(this)
  }
  togglebutton (toggleactive) {
    this.props.updateParent()
  }
  logout = () => {
    Storage.clear()
    this.props.updatingAuthenticate({
      mobileNo: null,
      token: null,
      profile: null
    })
    window.location.reload()
  }

  changeLanguage = e => {
    this.props.updatingCurrentLanguage(e.target.value)
    counterpart.setLocale(e.target.value)
  }

  render () {
    const { location } = this.props
    const locationSplit = location.pathname.split('/')
    locationSplit.pop()
    const backPath = locationSplit.length > 1 ? locationSplit.join('/') : ''

    return (
      <div className='top-bar'>
        <div className='-intro-x breadcrumb mr-auto hidden sm:flex app-top-header'>
          {/* <a href="" className="">Application</a>
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className="feather feather-chevron-right breadcrumb__icon">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="" className="breadcrumb--active">Dashboard</a> */}

          {backPath !== '' && (
            <NavLink to={backPath}>
              {' '}
              <i className='fa fa-angle-left' /> <Translate content='back' />
            </NavLink>
          )}
        </div>

        {/* <div className="intro-x dropdown relative  sm:mr-6" style={{ marginLeft: "27px", cursor: "pointer" }}>
                    <select value={this.props.currentLanguage} onChange={this.changeLanguage} style={{ border: "1px solid #ccc", width: "100px"}}>
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                    </select>
                </div> */}

        <div
          className='intro-x dropdown w-8 h-8 relative profile-icon'
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
        >
          {/* <div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in">
                        <img alt=" " src={profile} />
                    </div> */}
          <i className='fa fa-user' />
          {/* <div className="dropdown-box mt-10 absolute w-56 top-0 right-0 z-20">
                        <div className="dropdown-box__content box bg-theme-38 text-white">
                            <div className="p-4 border-b border-theme-40">
                                <div className="font-medium">Robert De Niro</div>
                                <div className="text-xs text-theme-41">DevOps Engineer</div>
                            </div>
                            <div className="p-2">
                                <a href=""
                                    className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" className="feather feather-user w-4 h-4 mr-2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg> Profile </a>
                                <a href=""
                                    className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" className="feather feather-edit w-4 h-4 mr-2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg> Add Account </a>
                                <a href=""
                                    className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" className="feather feather-lock w-4 h-4 mr-2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg> Reset Password </a>
                                <a href=""
                                    className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" className="feather feather-help-circle w-4 h-4 mr-2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg> Help </a>
                            </div>
                            <div className="p-2 border-t border-theme-40">
                                <a href=""
                                    className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" className="feather feather-toggle-right w-4 h-4 mr-2">
                                        <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                        <circle cx="16" cy="12" r="3"></circle>
                                    </svg> Logout </a>
                            </div>
                        </div>
                    </div> */}
        </div>

        <div
          className='intro-x dropdown relative  sm:mr-6'
          style={{ marginLeft: '5px', cursor: 'pointer' }}
          onClick={this.logout}
        >
          {/* Logout */}
          <svg
            style={{ display: 'inline-block' }}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='feather feather-log-out mx-auto'
          >
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
            <polyline points='16 17 21 12 16 7'></polyline>
            <line x1='21' y1='12' x2='9' y2='12'></line>
          </svg>
          <p style={{ display: 'inline-block', fontWeight: '600' }}>
            <Translate content='logout' />
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config,
  currentLanguage: state.auth.currentLanguage
})

const mapDispatchToProps = dispatch => ({
  updatingAuthenticate (data) {
    dispatch(authenticate(data))
  },
  updatingCurrentLanguage (data) {
    dispatch(updateCurrentLanguage(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
