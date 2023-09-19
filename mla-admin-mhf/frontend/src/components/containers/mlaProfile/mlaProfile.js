import React from 'react'
import './mlaProfile.scss'
import { NavLink } from 'react-router-dom'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Card,
  CardBody
} from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import adminService from '../../services/adminService'

import Translate from 'react-translate-component'
class MlaProfile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profileDetails: [],
      socialLinks: {},
      socialModal: false,
      selectedType: '',
      socialLink: '',
      errorMsg: '',
      apiInProgress: false
    }
  }
  componentDidMount () {
    this.getProfile(this.props.match.profile_id)
    this.socialMediaLinkings()
    console.log(this.props.match.path._id)
  }

  getProfile = profile_id => {
    var thisView = this
    axios
      .all([adminService.getProfile(this.props.match.params.profile_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (resData.data) {
              thisView.setState({ profileDetails: resData.data })
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

  socialMediaLinkings = () => {
    var thisView = this
    axios
      .all([adminService.socialMediaLinkings()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let mediaLinks = []
            if (resData.data) {
              mediaLinks = resData.data
            }

            let socialLinks = []
            mediaLinks.map(eachLink => {
              socialLinks[eachLink.socialMediaType] = eachLink
              return true
            })

            thisView.setState({ Success_msg: '', socialLinks })
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

  updateSocial = type => {
    const { socialLinks } = this.state
    this.setState({ selectedSocialLink: socialLinks[type], selectedType: type })
    if (socialLinks[type]) {
      this.setState({
        linkOperation: 'update',
        socialLink: socialLinks[type]['socialMediaTypeUrl']
      })
    } else {
      this.setState({ linkOperation: 'insert' })
    }
    this.toggleSocialLinkModal()
  }

  toggleSocialLinkModal = () => {
    this.setState({ socialLinkModal: !this.state.socialLinkModal })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitSocialLink = e => {
    e.preventDefault()
    const { linkOperation, socialLink } = this.state

    if (!socialLink || socialLink.trim() === '') {
      this.setState({ errorMsg: 'Link should not be empty' })
      return
    } else {
      this.setState({ errorMsg: '' })
    }

    if (linkOperation === 'insert') {
      this.insertSocialLink()
    } else if (linkOperation === 'update') {
      this.updateSocialLink()
    }
  }

  insertSocialLink = () => {
    var thisView = this
    const { selectedType, socialLink } = this.state
    this.setState({ apiInProgress: true })
    axios
      .all([adminService.insertSocialMediaLinking(selectedType, socialLink)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({ socialLink: '', linkOperation: '' })
            thisView.toggleSocialLinkModal()
            thisView.socialMediaLinkings()
          } else {
            thisView.setState({ errorMsg: resData })
          }
        }
        thisView.setState({ apiInProgress: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  updateSocialLink = () => {
    var thisView = this
    const { selectedSocialLink, selectedType, socialLink } = this.state
    this.setState({ apiInProgress: true })
    axios
      .all([
        adminService.socialMediaLinkingUpdate(
          selectedSocialLink._id,
          selectedType,
          socialLink
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({ socialLink: '', linkOperation: '' })
            thisView.toggleSocialLinkModal()
            thisView.socialMediaLinkings()
          } else {
            thisView.setState({ errorMsg: resData })
          }
        }
        thisView.setState({ apiInProgress: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  render () {
    const { match } = this.props
    const { selectedType, errorMsg, apiInProgress } = this.state

    return (
      <div className='col-span-12 mla-profile'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='profile' />
            </h2>
            <NavLink to={match.path + '/update'} className='ml-auto flex '>
              {' '}
              <Translate content='update' />{' '}
            </NavLink>
          </div>

          {/* <NavLink to={match.path + "/" + this.state.profileDetails.id} className="mlac-each">
                        <div className="mlace-head">           
                    <i className="fa fa-edit mlac-edit" onClick= { this.updateProfile }/>
                   </div>
                   </NavLink> */}
        </div>
        <Row>
          <Col sm md lg={12} className='mb-30'>
            <Card className='card-statistics h-100'>
              <CardBody>
                <div className='intro-y box px-5 '>
                  <div className='flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5'>
                    <div className='flex flex-1 px-5 items-center justify-center lg:justify-start'>
                      <div className='w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative'>
                        {this.state.profileDetails.mlaPhoto &&
                          this.state.profileDetails.mlaPhoto !== '' && (
                            <img
                              alt=' '
                              className='rounded-full'
                              src={
                                this.props.config.fileBasicPath +
                                this.state.profileDetails.mlaPhoto
                              }
                            ></img>
                          )}

                        {/* <div className="absolute mb-1 mr-1 flex items-center justify-center bottom-0 right-0 bg-theme-1 rounded-full p-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera w-4 h-4 text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </div> */}
                      </div>
                      <div className='ml-5'>
                        <div className='w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg'>
                          {this.state.profileDetails.fullName}
                        </div>
                        {/* <div className="text-gray-600">{this.state.profileDetails.qualification}</div> */}
                      </div>
                    </div>
                    <div className='flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 px-5 border-l border-r border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0'>
                      {/* <div className="truncate sm:whitespace-normal flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail w-4 h-4 mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> tomcruise@gmail.com </div>
                                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram w-4 h-4 mr-2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram Tom Cruise </div>
                                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter w-4 h-4 mr-2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> Twitter Tom Cruise </div> */}
                      {/* <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone w-4 h-4 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                {this.state.profileDetails.mobileNo}
                                            </div> */}
                    </div>
                  </div>
                  {/* <div className="nav-tabs flex flex-col sm:flex-row justify-center lg:justify-start"> <a data-toggle="tab" data-target="#dashboard" href="javascript:;" className="py-4 sm:mr-8 active">Dashboard</a> <a data-toggle="tab" data-target="#account-and-profile" href="javascript:;" class="py-4 sm:mr-8">Account &amp; Profile</a> <a data-toggle="tab" data-target="#activities" href="javascript:;" class="py-4 sm:mr-8">Activities</a> <a data-toggle="tab" data-target="#tasks" href="javascript:;" class="py-4 sm:mr-8">Tasks</a> </div> */}
                </div>
                <div className='intro-y news p-5 box mt-8'>
                  <h2 className='intro-y font-medium text-xl sm:text-2xl'>
                    <Translate content='about' />
                  </h2>{' '}
                  <br></br>
                  <div className='intro-y text-justify leading-relaxed'>
                    <p className='mb-5'>{this.state.profileDetails.aboutMLA}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* <Row>
                    <Col sm md lg={12} className="mb-1">
                        <Card className="card-statistics h-100">
                            <CardBody>
                                
                                <div className="intro-y news p-5 box mt-1">

                                    <h2 className="intro-y font-medium text-xl sm:text-2xl">
                                    <Translate content="social" />
                                    </h2> <br></br>
                                    <div className="intro-y text-justify leading-relaxed">
                                        <div className="eachsocial">
                                            <Translate content="facebook" /> {":"}
                                            {
                                                socialLinks["facebook"] &&
                                                <a className="eachSocialLink" href={socialLinks["facebook"]["socialMediaTypeUrl"]} target="_blank">
                                                    {socialLinks["facebook"]["socialMediaTypeUrl"]} 
                                                </a>
                                                
                                            }
                                            <i className="fa fa-edit social-edit" onClick= {() => {this.updateSocial('facebook')} }/>
                                        </div>
                                        <div className="eachsocial">
                                            <Translate content="twitter" /> {":"}
                                            {
                                                socialLinks["twitter"] &&
                                                <a className="eachSocialLink" href={socialLinks["twitter"]["socialMediaTypeUrl"]} target="_blank">
                                                    {socialLinks["twitter"]["socialMediaTypeUrl"]} 
                                                </a>
                                            }
                                            <i className="fa fa-edit social-edit" onClick= {() => {this.updateSocial('twitter')} }/>
                                        </div>
                                    </div>

                                </div>

                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}

        <Modal
          isOpen={this.state.socialLinkModal}
          className='social-media-modal'
        >
          <Form onSubmit={this.submitSocialLink} className=''>
            <ModalHeader
              toggle={this.toggleSocialLinkModal}
              className='design-modal-header'
            >
              <p>Update {selectedType}</p>
            </ModalHeader>
            <ModalBody>
              {errorMsg !== '' && (
                <div className='errormsg'>
                  <Alert color='danger'>{errorMsg}</Alert>
                </div>
              )}
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label> Link </Label>
                    <Input
                      className='input-name'
                      type='text'
                      onChange={this.onChange}
                      value={this.state.socialLink}
                      name='socialLink'
                      id='socialLink'
                      placeholder='Link'
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col className='add-button'>
                  {apiInProgress ? (
                    <i className='fa fa-spin fa-refresh' />
                  ) : (
                    <Button
                      type='submit'
                      color='primary'
                      className='submit-login float-right btn-s'
                    >
                      <span className='text-white'> Update</span>
                    </Button>
                  )}
                </Col>
              </Row>
            </ModalBody>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MlaProfile)
