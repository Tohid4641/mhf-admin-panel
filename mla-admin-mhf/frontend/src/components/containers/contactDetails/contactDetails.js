import React from 'react'

import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import axios from 'axios'
import { connect } from 'react-redux'

import adminService from '../../services/adminService'

import './contactDetails.scss'

class ContactDetails extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      contactDetails: []
    }
  }

  componentDidMount () {
    this.getContactDetails(this.props.match.params.contact_id)
    console.log(this.props.match.params.contact_id)
  }

  getContactDetails = contact_id => {
    var thisView = this
    axios
      .all([adminService.getContactDetails(contact_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let contactDetails = resData.data

            if (resData.data) {
              thisView.setState({ contactDetails })
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
    const { config } = this.props
    // const { contactDetails } = this.state;
    console.log(this.state.contactDetails)

    return (
      <div className='col-span-12 mla-complaints'>
        <div className='intro-y news p-5 box mt-8'>
          <h2 className='intro-y font-medium text-xl sm:text-2xl mt-5'>
            {this.state.contactDetails.firstName}
          </h2>

          <div className='intro-y text-justify leading-relaxed mt-3'>
            <p>{this.state.contactDetails.role}</p>
            <p>{this.state.contactDetails.email}</p>
            <p>{this.state.contactDetails.mobileNo}</p>
            <p>{this.state.contactDetails.address}</p>
          </div>
          <br></br>

          {/* <UncontrolledCarousel className="adjust" items={items} /> */}
          {ContactDetails.profilePhoto &&
            ContactDetails.profilePhoto.length > 0 && (
              <Carousel>
                {ContactDetails.profilePhoto.map((eachImage, index) => {
                  return (
                    <div key={index}>
                      <img src={config.fileBasicPath + eachImage} alt='img' />
                    </div>
                  )
                })}
              </Carousel>
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails)
