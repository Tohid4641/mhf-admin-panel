import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap'
import adminService from '../../services/adminService'
import moment from 'moment'
import { connect } from 'react-redux'
import { updateEventStatusFilter } from '../../../store/actions/auth'
import './events.scss'
import { DateRangePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import 'react-dates/initialize'

import Translate from 'react-translate-component'
import PageLoading from '../../elements/pageLoading/pageLoading'

class Events extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      startDate: null,
      endDate: null,
      msg: true,
      apiSuccess: '',
      eventsList: [],
      eventid: '',
      modal: false,
      eventsMain: [],
      searchText: '',
      authenticating: false,
      fetchingDetails: false,
      eventFilterStatusOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Closed', value: 'Closed' }
      ],
      eventFilterStatusSelected: { label: 'Pending', value: 'Pending' }
    }
  }

  componentDidMount () {
    let selectedStatusFilter = this.props.eventStatusFilter
      ? this.props.eventStatusFilter
      : this.state.eventFilterStatusSelected
    this.setState({ eventFilterStatusSelected: selectedStatusFilter })
    this.getEvents(selectedStatusFilter.value)
  }

  handleChange = selectedOption => {
    this.setState({ eventFilterStatusSelected: selectedOption })
    this.props.updatingEventStatusFilter(selectedOption)
    this.getEvents(selectedOption.value)
  }

  getEvents = (status, refresh = false) => {
    var thisView = this
    if (!refresh) thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getEventsProjects('Event', status)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          let events = resData.data ? resData.data : []
          let eventsList = events.map((eachEvent, index) => {
            return {
              id: eachEvent._id,
              details: {
                index: index,
                id: eachEvent._id,
                status: eachEvent.eventStatus,
                eventProjectName: eachEvent.eventProjectName,
                eventProjectPlace: eachEvent.eventProjectPlace,
                eventProjectDescription:
                  eachEvent.eventProjectDescription &&
                  eachEvent.eventProjectDescription.length > 250
                    ? eachEvent.eventProjectDescription.slice(0, 250) + '...'
                    : eachEvent.eventProjectDescription.slice(0, 250),
                date: moment(eachEvent.eventProjectDate).format(
                  'Do MMM YYYY hh:mm A'
                )
                  ? moment(eachEvent.eventProjectDate).format(
                      'Do MMM YYYY hh:mm A'
                    )
                  : ''
              }
            }
          })
          thisView.setState({ eventsList, eventsMain: eventsList })
        }

        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  getfilterEvents = (startDate, endDate) => {
    // const { startDate, endDate } = this.state;

    let sDate = startDate ? moment(startDate).format('YYYY-MM-DD') : null
    let eData = endDate ? moment(endDate).format('YYYY-MM-DD') : null

    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getfilterEvents('Event', sDate, eData)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          let events = resData.data ? resData.data : []
          let eventsList = events.map((eachEvent, index) => {
            return {
              id: eachEvent._id,
              details: {
                index: index,
                id: eachEvent._id,
                status: eachEvent.eventStatus,
                eventProjectName: eachEvent.eventProjectName,
                eventProjectPlace: eachEvent.eventProjectPlace,
                eventProjectDescription:
                  eachEvent.eventProjectDescription &&
                  eachEvent.eventProjectDescription.length > 250
                    ? eachEvent.eventProjectDescription.slice(0, 250) + '...'
                    : eachEvent.eventProjectDescription.slice(0, 250),
                date: moment(eachEvent.eventProjectDate).format(
                  'Do MMM YYYY hh:mm A'
                )
                  ? moment(eachEvent.eventProjectDate).format(
                      'Do MMM YYYY hh:mm A'
                    )
                  : ''
              }
            }
          })
          thisView.setState({ eventsList, eventsMain: eventsList })
        }

        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  formatEvent = (cell, row) => {
    return (
      <div>
        <NavLink
          to={this.props.match.path + '/' + cell.id}
          className='mlac-each'
        >
          <div className='mlace-head'>
            <span>{cell.eventProjectName}</span>
            <span className='mlacer-date'>{cell.date}</span>
            <span className='mlac-status'>
              <i
                className='fa fa-edit mlac-edit'
                onClick={e => {
                  this.updateEvent(e, cell)
                }}
              />
            </span>
            <span>
              <i
                className='fa fa-trash mlac-delete'
                style={{ cursor: 'pointer' }}
                onClick={e => {
                  this.toggle(e, cell.id)
                }}
              />
            </span>
          </div>
          <span className='mlace-content' sm={12}>
            {cell.eventProjectDescription}
          </span>
        </NavLink>
      </div>
    )
  }

  deleteEvent = () => {
    var thisView = this
    thisView.setState({ authenticating: true, msg: !this.state.msg })

    let eventProjectType = ''
    // let contactid = this.props.match.id;
    if (this.props.location.pathname.indexOf('events') > -1) {
      eventProjectType = 'Event'
    }

    this.setState({ authenticating: true })
    axios
      .all([adminService.deleteEvent(this.state.eventid, eventProjectType)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({ apiSuccess: 'Event deleted successfully ' })

            // if (insertType === "")
            //     thisView.props.history.push("/contacts");
            // else if (insertType === "headOfService")
            //     thisView.props.history.push("/serviceheads");

            // setTimeout(() => window.location.reload(), thisView.props.history.push("/contacts"), window.location.reload(), 4000);

            setTimeout(
              () => thisView.setState({ modal: !thisView.state.modal }),
              1000
            )
            // setTimeout(() => thisView.getEvents(), 2000);
            thisView.getEvents('', true)
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
        // setTimeout(() => window.location.reload(), thisView.setState({ modal: false }), 4000);
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  toggle = (e, cell) => {
    e.preventDefault()
    if (cell) {
      this.setState({ eventid: cell })
    }
    this.setState({
      modal: !this.state.modal
    })
    console.log(cell)
  }

  updateEvent = (e, cell) => {
    e.preventDefault()
    this.props.history.push(this.props.match.path + '/update/' + cell.id)
  }

  filterEvents = event => {
    let searchText = this.state.searchText
    if (event) searchText = event.target.value

    let eventsList = []
    if (searchText && searchText.length >= 2) {
      eventsList = this.state.eventsMain.filter(eachEvent => {
        if (
          eachEvent.details.eventProjectName
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1 ||
          eachEvent.details.eventProjectPlace
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1 ||
          eachEvent.details.date
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1
        )
          return true
        else return false
      })
    } else {
      eventsList = this.state.eventsMain
    }

    this.setState({ searchText, eventsList })
  }

  filterData = (startDate, endDate) => {
    this.getfilterEvents(startDate, endDate)
  }

  render () {
    const { eventStatusFilter, match } = this.props
    const {
      eventsList,
      fetchingDetails,
      eventFilterStatusSelected
    } = this.state
    let selectedStatusFilter = eventStatusFilter
      ? eventStatusFilter
      : eventFilterStatusSelected

    return (
      <div className='col-span-12 mla-events'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10'>
            {/* <h2 className='text-lg text-black font-medium'></h2> */}
            <NavLink
              to={match.path + '/add'}
              className='ml-auto flex text-theme-1 btn custom-btn'
            >
              <Translate content='add' />
            </NavLink>
          </div>
        </div>
        <Row className='intro-y mt-3 mb-3'>
          <Col md={8}>
            <h2 className='font-weight-bold'>
              {/* <Translate content="events" /> */}
              Activities & Announcements
            </h2>
          </Col>
          <Col md={4}>
            <i
              className='fa fa-refresh mlac-refresh'
              onClick={() => {
                this.getEvents(selectedStatusFilter.value)
              }}
            />
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal}
          style={{ marginTop: '0px', marginLeft: '0px' }}
        >
          <ModalHeader
            style={{ backgroundColor: '#253c80', color: 'white' }}
            toggle={this.toggle}
          >
            Confimation{' '}
          </ModalHeader>
          <ModalBody>
            {this.state.msg && (
              <p>Are you sure you want to delete this Event</p>
            )}
            {this.state.apiSuccess && (
              <div className='errormsg'>
                <Alert color='success'>{this.state.apiSuccess}</Alert>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {!this.state.authenticating ? (
              <Button
                className=' btn btn-primary '
                color='danger'
                onClick={this.deleteEvent}
              >
                <span className='text-white'>Delete</span>
              </Button>
            ) : (
              <i className='fa fa-spin fa-refresh authentication-loading' />
            )}
          </ModalFooter>
        </Modal>

        <Row className={'intro-y'}>
          <Col sm md={7}></Col>

          <Col sm md={5} className='date-filter'>
            <DateRangePicker
              enableOutsideDays={true}
              isOutsideRange={() => false}
              isDayHighlighted={day => day.isSame(new Date(), 'd')}
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              startDateId='your_unique_start_date_id' // PropTypes.string.isRequired,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId='your_unique_end_date_id' // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                this.setState({ startDate, endDate })
                this.filterData(startDate, endDate)
              }} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
            />
          </Col>
          {!fetchingDetails ? (
            <Col sm md lg={12} className='mb-30'>
              <Card className='card-statistics h-100'>
                <Row className='mlac-search-container'>
                  <Col xs={12} sm={12} md={6} lg={8}>
                    {/* <Select
                                                name="mlac-status-filter" className="selectbox mlac-status-filter w-full flex-1"
                                                onChange={this.handleChange}
                                                placeholder="Status Filter"
                                                options={eventFilterStatusOptions}
                                                value={eventFilterStatusSelected}
                                                isSearchable
                                                style={{ border: 'none !important' }}
                                                isLoading={fetchingDetails}
                                                isDisabled={fetchingDetails}
                                            /> */}
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={4}>
                    <input
                      className='form-control mlac-search'
                      value={this.state.field_search_input}
                      placeholder={'Search'}
                      onChange={this.filterEvents}
                      onKeyDown={this.filterEvents}
                      ref={input => {
                        this.searchInput = input
                      }}
                    />
                  </Col>
                </Row>

                <CardBody>
                  <BootstrapTable
                    data={eventsList}
                    pagination
                    striped
                    condensed
                    // search
                  >
                    <TableHeaderColumn
                      className='mlac-row'
                      dataField='details'
                      dataFormat={this.formatEvent}
                      isKey
                    ></TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <PageLoading />
          )}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  eventStatusFilter: state.auth.eventStatusFilter
})

const mapDispatchToProps = dispatch => ({
  updatingEventStatusFilter (data) {
    dispatch(updateEventStatusFilter(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Events)
