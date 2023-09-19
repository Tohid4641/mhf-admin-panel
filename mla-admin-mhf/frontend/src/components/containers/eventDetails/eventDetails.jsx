import React from 'react'
// import { Link, NavLink } from 'react-router-dom';
import { Button } from 'reactstrap'
import { Carousel } from 'react-responsive-carousel'
// import { UncontrolledCarousel } from 'reactstrap';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import moment from 'moment'
import { connect } from 'react-redux'
// import Form from 'react-validation/build/form';
// import Input from 'react-validation/build/input'
import axios from 'axios'
import adminService from '../../services/adminService'
import './eventDetails.scss'
// import "node_modules/video-react/dist/video-react.css";
// import { Player } from 'video-react';
import ReactPlayer from 'react-player'

import PrepareMail from '../prepareMail'

class EventDetails extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      eventDetails: [],
      description: '',
      modal: false,
      event_title: '',
      options: []
    }

    this.addevent = this.addevent.bind(this)
    this.onChange = this.onChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount () {
    this.getEventDetails(this.props.match.params.event_id)
  }

  getEventDetails = event_id => {
    var thisView = this
    axios
      .all([adminService.getEventDetails(event_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let eventDetails = resData.data
            if (eventDetails.eventProjectFileNames) {
              eventDetails.eventProjectFileNames = JSON.parse(
                eventDetails.eventProjectFileNames
              )
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.images
              ) {
                eventDetails.filesProjectFileNames =
                  eventDetails.eventProjectFileNames.images
              }
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.videos
              ) {
                eventDetails.filesProjectVideoFileNames =
                  eventDetails.eventProjectFileNames.videos
              }
            }

            thisView.setState({ eventDetails })
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

  addevent () {
    this.setState({
      modal: !this.state.modal
    })
  }

  // onChange = (e) => {
  //     this.setState({ [e.target.name]: e.target.value });

  // }
  formSubmit (event) {
    event.preventDefault()
    console.log(this.state.description)
  }

  updateEvent = (e, cell) => {
    e.preventDefault()

    const { match } = this.props
    let id = match.params.event_id
    let url = match.url
    url = url.replace(id, 'update/' + id)
    this.props.history.push(url)
  }

  render () {
    // const { match } = this.props;
    const { eventDetails, modal } = this.state
    const { config } = this.props
    return (
      <div className='col-span-12 mla-eventdetails'>
        <div className='intro-y news p-5 box mt-8'>
          <div className='intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center border-t border-gray-200'>
            <div className='flex items-center'>
              {/* <div className="w-12 h-12 flex-none image-fit">
                                <img alt=" " className="rounded-full" src="images/profile-10.jpg" />
                            </div>
                            <div className="ml-3 mr-auto text-gray-600">
                                <a href="" className="font-medium text-black">Admin</a>, Author
                            </div> */}
            </div>
            <div className='edit-event-icon flex items-center text-gray-700 sm:ml-auto mt-5 sm:mt-0'>
              <div className='intro-y flex relative pt-16 sm:pt-6 items-center pb-6'>
                <div className='absolute sm:relative -mt-12 sm:mt-0 w-full flex text-gray-700 text-xs sm:text-sm'></div>
                {/* <a href="" className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share"> <i className="fa fa-share-alt" aria-hidden="true"></i></a> */}
                <div className='event-btn'>
                  {/* <Button className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share" onClick={this.addevent}>
                                        <i className="fa fa-share-alt" aria-hidden="true"></i></Button> */}
                  <Button
                    className='intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip'
                    title='Share'
                    onClick={this.updateEvent}
                  >
                    <i className='fa fa-edit mlac-edit' aria-hidden='true'></i>
                  </Button>
                  {modal && (
                    <PrepareMail
                      title='Share Event'
                      subject={eventDetails.eventProjectName}
                      content={eventDetails.eventProjectDescription}
                      closeModal={this.addevent}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <h2 className='intro-y font-medium text-xl sm:text-2xl mt-5'>
            {eventDetails.eventProjectName}
          </h2>
          <div className='intro-y text-gray-700 text-xs sm:text-sm'>
            {moment(this.state.eventDetails.eventProjectDate).format(
              'Do MMM YYYY hh:mm A'
            )}
            <span className='mx-1'>•</span>
            {eventDetails.eventProjectPlace}
          </div>
          <div className='intro-y text-justify leading-relaxed mt-3'>
            <p className='mb-5'>{eventDetails.eventProjectDescription}</p>
          </div>
          <br></br>

          {eventDetails.filesProjectFileNames &&
            eventDetails.filesProjectFileNames.length > 0 && (
              <Carousel>
                {eventDetails.filesProjectFileNames.map((eachImage, index) => {
                  return (
                    <div key={index}>
                      <img
                        className='ep-eachimage'
                        // src={ config.fileBasicPath + eachImage}
                        src={
                          eachImage.substring(0, 4) === 'http'
                            ? eachImage
                            : config.fileBasicPath + eachImage
                        }
                        alt='description'
                      />
                    </div>
                  )
                })}
              </Carousel>
            )}

          <br></br>
          {/* tesing  */}
          {eventDetails.filesProjectVideoFileNames &&
            eventDetails.filesProjectVideoFileNames.length > 0 && (
              <Carousel>
                {eventDetails.filesProjectVideoFileNames.map(
                  (eachImageVideo, index) => {
                    let splitData = eachImageVideo.split('||||')

                    return (
                      <div key={index} className='player-wrapper'>
                        <ReactPlayer
                          className='react-player'
                          url={
                            eachImageVideo.substring(0, 4) === 'http'
                              ? splitData[0]
                              : config.fileBasicPath + splitData[0]
                          }
                          width='100%'
                          height='100%'
                          controls={true}
                          keyBoardControl={true}
                        />
                      </div>
                    )
                  }
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
