import React from 'react'

// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios'
import { connect } from 'react-redux'

import adminService from '../../services/adminService'

import './serviceHeadDetails.scss'

class ServiceHeadDetails extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      serviceHeadDetails: []
    }
  }

  componentDidMount () {
    this.getServiceHeadDetails(this.props.match.params.serviceheads_id)
    // console.log(this.props.match.params.serviceheads_id);
  }

  getServiceHeadDetails = serviceheads_id => {
    var thisView = this
    axios
      .all([adminService.getServiceHeadDetails(serviceheads_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let serviceHeadDetails = resData.data

            if (resData.data) {
              thisView.setState({ serviceHeadDetails })
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
    return (
      <div className='col-span-12 mla-complaints'>
        <div className='intro-y news p-5 box mt-8'>
          <h2 className='intro-y font-medium text-xl sm:text-2xl mt-5'>
            {this.state.serviceHeadDetails.firstName}
          </h2>

          <div className='intro-y text-justify leading-relaxed mt-3'>
            <p>{this.state.serviceHeadDetails.role}</p>
            <p>{this.state.serviceHeadDetails.email}</p>
            <p>{this.state.serviceHeadDetails.mobileNo}</p>
            <p>{this.state.serviceHeadDetails.address}</p>
          </div>
          <br></br>

          {/* <UncontrolledCarousel className="adjust" items={items} /> */}
          {/* {
                        serviceHeadDetails.profilePhoto && serviceHeadDetails.profilePhoto.length > 0 &&
                        <Carousel>
                            {
                                serviceHeadDetails.profilePhoto.map((eachImage, index) => {
                                    return (
                                        <div key={index}>
                                            <img src={ config.fileBasicPath + eachImage} alt="img" />
                                        </div>
                                    )
                                })
                            }
                        </Carousel>

                    } */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceHeadDetails)
