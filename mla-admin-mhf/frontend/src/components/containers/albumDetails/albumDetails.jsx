import React from 'react'
// import { Link, NavLink } from 'react-router-dom';
// import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { Carousel } from 'react-responsive-carousel'
// import { UncontrolledCarousel } from 'reactstrap';
import {
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import adminService from '../../services/adminService'
import { Editor } from '@tinymce/tinymce-react'
import Translate from 'react-translate-component'

import './albumDetails.scss'
// import "node_modules/video-react/dist/video-react.css";
// import { Player } from 'video-react';
import ReactPlayer from 'react-player'

class AlbumDetails extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      albumDetails: [],
      description: '',
      modal: false
    }
    this.addevent = this.addevent.bind(this)
    this.onChange = this.onChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }

  componentDidMount () {
    this.getAlbumDetails(this.props.match.params.album_id)
  }

  getAlbumDetails = album_id => {
    var thisView = this
    axios
      .all([adminService.getAlbum(album_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let album = resData.data
            let albumDetails = {}
            // let albumFiles = album.albumFiles ? album.albumFiles.replace(/\&quot;/g, '"' ) : "";
            let albumFiles = album.albumFiles
              ? album.albumFiles.replace(/quot;/g, '"')
              : ''
            albumDetails = {
              id: album._id,
              albumTitle: album.albumTitle,
              albumFiles: JSON.parse(albumFiles),
              albumDate: album.createdAt
            }

            if (albumDetails.albumFiles) {
              if (albumDetails.albumFiles && albumDetails.albumFiles.images) {
                albumDetails.albumFileNames = albumDetails.albumFiles.images
              }
              if (albumDetails.albumFiles && albumDetails.albumFiles.videos) {
                albumDetails.albumVideoFileNames =
                  albumDetails.albumFiles.videos
              }
            }
            console.log(albumDetails)
            thisView.setState({ albumDetails })
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

  updateEvent = (e, cell) => {
    e.preventDefault()

    const { match } = this.props
    let id = match.params.album_id
    let url = match.url
    url = url.replace(id, 'update/' + id)
    this.props.history.push(url)
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  formSubmit (event) {
    event.preventDefault()
    console.log(this.state.description)
  }

  render () {
    // const { match } = this.props;
    const { albumDetails } = this.state
    const { config } = this.props

    return (
      <div className='col-span-12 mla-albumdetails'>
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
            <div className='flex items-center text-gray-700 sm:ml-auto mt-5 sm:mt-0'>
              <div className='intro-y flex relative pt-16 sm:pt-6 items-center pb-6'>
                <div className='absolute sm:relative -mt-12 sm:mt-0 w-full flex text-gray-700 text-xs sm:text-sm'></div>
                {/* <a href="" className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share"> <i className="fa fa-share-alt" aria-hidden="true"></i></a> */}
                <div className='event-btn'>
                  <Button
                    className='intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip'
                    title='Share'
                    onClick={this.addevent}
                  >
                    <i className='fa fa-share-alt' aria-hidden='true'></i>
                  </Button>
                  <Button
                    className='intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip'
                    title='Share'
                    onClick={this.updateEvent}
                  >
                    <i className='fa fa-edit mlac-edit' aria-hidden='true'></i>
                  </Button>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.addevent}
                    className={this.props.className}
                  >
                    <Form
                      ref={c => {
                        this.form = c
                      }}
                      onSubmit={this.formSubmit}
                    >
                      <ModalHeader toggle={this.addevent}>
                        <Translate content='add event' />{' '}
                      </ModalHeader>
                      <ModalBody>
                        <div class='form-group'>
                          <Editor
                            name='description'
                            onChange={this.onChange}
                            className='form-control'
                            value={this.state.albumDetails.albumTitle}
                            apiKey='tw738oi7eejqelkvij9eko7n5fnt0xd7v90seimw8zjvehzc'
                            init={{
                              plugins: 'link image code',
                              toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | code',
                              branding: false
                            }}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          className='button btn btn-secondary btn-xsmall'
                          type='submit'
                        >
                          <Translate content='add' />
                        </Button>{' '}
                        <Button
                          className='button black btn btn-secondary btn-xsmall'
                          onClick={this.addevent}
                        >
                          <Translate content='cancel' />
                        </Button>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          <h2 className='intro-y font-medium text-xl sm:text-2xl mt-5'>
            {albumDetails.albumTitle}
          </h2>
          <div className='intro-y text-gray-700 text-xs sm:text-sm'>
            {moment(albumDetails.albumDate).format('Do MMM YYYY hh:mm A')}
          </div>
          <br></br>

          {albumDetails.albumFileNames &&
            albumDetails.albumFileNames.length > 0 && (
              <Carousel>
                {albumDetails.albumFileNames.map((eachImage, index) => {
                  return (
                    <div key={index}>
                      <img
                        className='ep-eachimage'
                        src={config.s3BasicPath + eachImage}
                        alt='description'
                      />
                    </div>
                  )
                })}
              </Carousel>
            )}

          <br></br>
          {/* tesing  */}
          {albumDetails.albumVideoFileNames &&
            albumDetails.albumVideoFileNames.length > 0 && (
              <Carousel>
                {albumDetails.albumVideoFileNames.map(
                  (eachImageVideo, index) => {
                    let splitData = eachImageVideo.split('||||')
                    return (
                      <div key={index} className='player-wrapper'>
                        <ReactPlayer
                          className='react-player'
                          url={
                            eachImageVideo.substring(0, 4) === 'http'
                              ? splitData[0]
                              : config.s3BasicPath + splitData[0]
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

export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetails)
