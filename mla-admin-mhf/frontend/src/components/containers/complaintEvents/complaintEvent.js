import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Card } from 'reactstrap'
import { Carousel } from 'react-responsive-carousel'
// import { UncontrolledCarousel } from 'reactstrap';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import Select from 'react-select'
import './complaintEvent.scss'
import adminService from '../../services/adminService'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import MaterialIcon from 'material-icons-react'
import Translate from 'react-translate-component'

class ComplaintEvent extends React.Component {
  constructor (props) {
    super(props)
    this.updateComplaintPublish = this.updateComplaintPublish.bind(this)

    this.state = {
      complaitDetails: {},
      complaintDetailsLogs: [],
      complaintStatus: '',
      complaintStatusOptions: [
        { label: <Translate content='pending' />, value: 'Pending' },
        { label: <Translate content='in progress' />, value: 'In Progress' },
        { label: <Translate content='closed' />, value: 'Closed' }
      ],
      fetchingDetails: false,
      complaintHasDetails: false,
      updatingStatus: false,
      publishStatus: false
    }
  }

  componentDidMount () {
    this.getComplaintDetails(this.props.match.params.complaint_id)
  }

  getComplaintDetails = complaint_id => {
    var thisView = this
    this.setState({ fetchingDetails: true })
    axios
      .all([adminService.getComplaintDetails(complaint_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data

          if (resData.status) {
            let complaitDetails = resData.data
            // console.log(complaitDetails.logs)
            let complaintDetailsLogs = complaitDetails.logs
            let complaintStatus = {
              label: complaitDetails.complaintStatus,
              value: complaitDetails.complaintStatus
            }
            thisView.setState({
              complaitDetails,
              complaintDetailsLogs,
              complaintStatus,
              complaintHasDetails: true
            })
            thisView.setState({ Success_msg: '' })
          } else {
            thisView.setState({ apiError: resData })
          }
        }
        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in complaint Details')
      })
  }

  handleChange = selectedOption => {
    this.setState({ complaintStatus: selectedOption })
    this.updateComplaintStatus(selectedOption.value)
  }

  updateComplaintStatus = status => {
    var thisView = this
    this.setState({ updatingStatus: true })
    axios
      .all([
        adminService.updateComplaintStatus(
          this.props.match.params.complaint_id,
          status
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let complaintUpdated = resData.data
            console.log(complaintUpdated)
          } else {
            thisView.setState({ apiError: resData })
          }
        }
        thisView.setState({ updatingStatus: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  updateComplaintPublish = status => {
    var thisView = this
    this.setState({ publishStatus: true })
    axios
      .all([
        adminService.updateComplaintPublish(
          this.props.match.params.complaint_id,
          status
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let updateComplaintPublished = resData.data
            console.log(updateComplaintPublished)
            thisView.getComplaintDetails(
              thisView.props.match.params.complaint_id
            )
            // thisView.props.history.push("/complaints");
          } else {
            thisView.setState({ apiError: resData })
          }
        }
        thisView.setState({ publishStatus: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  render () {
    // const { match } = this.props;
    const {
      complaitDetails,
      complaintDetailsLogs,
      fetchingDetails,
      complaintStatus,
      complaintStatusOptions,
      complaintHasDetails,
      updatingStatus,
      publishStatus
    } = this.state
    const { config } = this.props

    return (
      <div className='col-span-12 mla-complaints-details'>
        {complaitDetails && complaitDetails.complaintNumber && (
          <Card className='intro-y alignment complaint-status-card'>
            <Row className='container mt-3'>
              <Col sm={12} md={6} lg={6}>
                <span className='br'></span>
                <p className='font-weight-bold'>
                  {complaitDetails.complaintNumber}
                </p>
                <p className='secondary mt-1'>
                  <Translate content='Complaint Number' />
                </p>
              </Col>

              <Col sm={12} md={6} lg={6}>
                {/* <span className="br"></span> */}
                <p className='font-weight-bold'>
                  {moment(complaitDetails.createdAt).format(
                    'Do MMM YYYY hh:mm A'
                  )}
                </p>
                <p className='secondary mt-1'>
                  {' '}
                  <Translate content='created date' />
                </p>
              </Col>

              <Col sm={12} md={6} lg={6}>
                <span className='br'></span>
                <p className='font-weight-bold'>
                  {complaitDetails &&
                    complaitDetails.user &&
                    complaitDetails.user.fullName &&
                    complaitDetails.user.fullName}
                  {complaitDetails &&
                    complaitDetails.user &&
                    complaitDetails.user.mobileNo && (
                      <span> - {complaitDetails.user.mobileNo} </span>
                    )}
                </p>
                <p className='secondary mt-1'>
                  <Translate content='ticket raised by' />
                </p>
              </Col>

              <Col sm={12} md={6} lg={6}>
                {/* <span className="br"></span> */}
                <p className='text-warning font-weight-bold'>
                  {complaitDetails.complaintStatus}
                  {complaitDetails.complaintStatus !== 'Closed' && (
                    <Fragment>
                      {' - '}{' '}
                      {moment(new Date()).diff(
                        moment(complaitDetails.createdAt),
                        'days'
                      )}{' '}
                      {' Days'}
                    </Fragment>
                  )}
                </p>
                <p className='secondary mt-1'>
                  <Translate content='status' />
                </p>
              </Col>
            </Row>
          </Card>
        )}

        {!fetchingDetails ? (
          complaintHasDetails ? (
            <div className='intro-y news p-5 box mt-2'>
              <Row>
                <Col xs={12} sm={12} md={6} lg={8}>
                  <h2 className='intro-y font-medium text-xl sm:text-2xl'>
                    {complaitDetails.complaintTitle}
                  </h2>
                  <div className='intro-y text-gray-700 text-xs sm:text-sm'>
                    {moment(complaitDetails.createdAt).format(
                      'Do MMM YYYY hh:mm A'
                    )}
                    <span className='mx-1'>•</span>
                    {complaitDetails.complaintLocation}
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  className='mlac-change-statue'
                >
                  <Select
                    name='mlac-status-change'
                    className='selectbox w-full  mt-2 flex-1'
                    onChange={this.handleChange}
                    options={complaintStatusOptions}
                    value={complaintStatus}
                    isSearchable
                    style={{ border: 'none !important' }}
                    isLoading={updatingStatus + publishStatus}
                    isDisabled={updatingStatus + publishStatus}
                  />
                  {complaitDetails.complaintPublish &&
                  complaitDetails.complaintPublish === 'Publish' ? (
                    <Button
                      style={{ float: 'right' }}
                      className=' btn btn-primary mt-3'
                      color='primary'
                      onClick={() => {
                        this.updateComplaintPublish('')
                      }}
                    >
                      <Translate content='unpublish' />
                    </Button>
                  ) : (
                    <Button
                      style={{ float: 'right' }}
                      className=' btn btn-primary mt-3'
                      color='primary'
                      onClick={() => {
                        this.updateComplaintPublish('Publish')
                      }}
                    >
                      <Translate content='publish' />
                    </Button>
                  )}
                </Col>
              </Row>

              <div className='intro-y text-justify leading-relaxed mt-5'>
                <p className='mb-5'>{complaitDetails.complaintDescription}</p>
              </div>
              <br></br>
              {/* <UncontrolledCarousel className="adjust" items={items} /> */}
              {complaitDetails.complaintFileNames &&
                complaitDetails.complaintFileNames !== '' && (
                  <Carousel>
                    <div>
                      <img
                        src={
                          config.fileBasicPath +
                          complaitDetails.complaintFileNames
                        }
                        alt='description'
                      />
                    </div>
                  </Carousel>
                )}

              <div className='intro-y flex text-xs sm:text-sm flex-col sm:flex-column items-center border-t border-gray-200'>
                <span className='malac-by'>
                  <Translate content='complaint by' />:{' '}
                </span>
                <div className='flex items-center'>
                  <div className='w-12 h-12 flex-none image-fit'>
                    {complaitDetails &&
                    complaitDetails.user &&
                    complaitDetails.user.userPhoto &&
                    complaitDetails.user.userPhoto !== '' ? (
                      <img
                        alt=' '
                        className='rounded-full'
                        src={
                          config.fileBasicPath + complaitDetails.user.userPhoto
                        }
                      />
                    ) : (
                      <img
                        alt=' '
                        className='rounded-full'
                        src='images/profile-10.jpg'
                      />
                    )}
                  </div>
                  <div className='ml-3 mr-auto text-gray-600'>
                    <Link className='font-medium text-black'>
                      {complaitDetails &&
                        complaitDetails.user &&
                        complaitDetails.user.fullName &&
                        complaitDetails.user.fullName}
                    </Link>
                    <span className='mx-1'>•</span>
                    <Link className='font-medium text-black'>
                      {complaitDetails &&
                        complaitDetails.user &&
                        complaitDetails.user.mobileNo &&
                        complaitDetails.user.mobileNo}
                    </Link>
                  </div>
                </div>
                <div className='flex items-center text-gray-700 sm:ml-auto mt-5 sm:mt-0'>
                  <div className='intro-y flex relative pt-16 sm:pt-6 items-center pb-6'>
                    {/* <div className="absolute sm:relative -mt-12 sm:mt-0 w-full flex text-gray-700 text-xs sm:text-sm">
                                    </div>
                                    <a href="" className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share"> <i className="fa fa-share-alt" aria-hidden="true"></i></a> */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>No Record Found</div>
          )
        ) : (
          <i className='fa fa-spin fa-refresh initial_loading' />
        )}
        <br></br>
        <hr></hr>

        <div className='complaint_status_track mt-3'>
          {complaintDetailsLogs.reverse().map(result => (
            <Timeline>
              <TimelineEvent
                title={result.complaintId}
                createdAt={moment(result.createdAt).format(
                  'Do MMM YYYY hh:mm A'
                )}
                icon={<MaterialIcon icon='person' />}
              >
                {result.complaintStatus}
              </TimelineEvent>
            </Timeline>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintEvent)
