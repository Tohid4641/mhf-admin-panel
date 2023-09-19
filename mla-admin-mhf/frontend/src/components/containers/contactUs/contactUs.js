import React from 'react'
import './contactUs.scss'
import { NavLink } from 'react-router-dom'
import { Row, Col, Card, CardBody } from 'reactstrap'
import axios from 'axios'
import adminService from '../../services/adminService'
import Translate from 'react-translate-component'

class ContactUs extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      contactUsDetails: []
    }
  }
  componentDidMount () {
    this.getContactUs(this.props.match.contactUs_id)
  }

  getContactUs = () => {
    var thisView = this
    axios
      .all([adminService.getContactUs()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (resData.data) {
              let contactUsDetails = resData.data
              let mobileNo = contactUsDetails.mobileNo
              mobileNo = mobileNo.split('||||')
              contactUsDetails.mobile = mobileNo[0]
              contactUsDetails.email = mobileNo[1]

              thisView.setState({ contactUsDetails })
            }

            thisView.setState({ Success_msg: '' })
          } else {
            thisView.setState({ apiError: resData })
          }
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  render () {
    const { match } = this.props

    return (
      <div className='col-span-12 contactUs'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='contactUs' />
            </h2>
            <NavLink to={match.path + '/update'} className='ml-auto flex '>
              <Translate content='update' />
            </NavLink>
          </div>
        </div>
        <Row>
          <Col sm md lg={12} className='mb-30'>
            <Card className='card-statistics h-100'>
              <CardBody>
                <div className='intro-y box px-5 '>
                  <div className='flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5'>
                    <div className='flex flex-1 px-5 items-center justify-center lg:justify-start'>
                      {/* <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                                <img alt=" " className="rounded-full" src={profile}></img>
                                                <div className="absolute mb-1 mr-1 flex items-center justify-center bottom-0 right-0 bg-theme-1 rounded-full p-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera w-4 h-4 text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </div>
                                            </div> */}
                      <div className='ml-5'>
                        <div className='truncate sm:whitespace-normal flex items-center mt-3'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            stroke-width='1.5'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            class='feather feather-phone w-4 h-4 mr-2'
                          >
                            <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
                          </svg>
                          {this.state.contactUsDetails.mobile}
                        </div>
                        {/* <div className="text-gray-600">{this.state.contactUsDetails.email}</div> */}
                      </div>
                    </div>
                    <div className='flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 px-5 border-l border-r border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0'>
                      <div className='truncate sm:whitespace-normal flex items-center'>
                        {' '}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          class='feather feather-mail w-4 h-4 mr-2'
                        >
                          <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                          <polyline points='22,6 12,13 2,6'></polyline>
                        </svg>
                        {this.state.contactUsDetails.email}
                      </div>
                      {/* <div className="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram w-4 h-4 mr-2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram Tom Cruise </div>
                                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter w-4 h-4 mr-2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> Twitter Tom Cruise </div>
                                            <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone w-4 h-4 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                {this.state.contactUsDetails.mobileNo}
                                            </div> */}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default ContactUs
