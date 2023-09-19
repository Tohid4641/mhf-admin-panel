import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { NavLink } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert
} from 'reactstrap'
import axios from 'axios'
import moment from 'moment'
import Select from 'react-select'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import { connect } from 'react-redux'
import './complaints.scss'
import validators from '../../validators/validators'
import adminService from '../../services/adminService'
import { updateComplaintFilters } from '../../../store/actions/auth'

// import { addDays } from 'date-fns';
// import { useState } from 'react';
import { DateRangePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import 'react-dates/initialize'
import Translate from 'react-translate-component'

// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css';
// const [state, setState] = useState([
//     {
//       startDate: new Date(),
//       endDate: addDays(new Date(), 7),
//       key: 'selection'
//     }
//   ]);
class Complaints extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.DateRangePicker = this.DateRangePicker.bind(this)

    this.state = {
      startDate: null,
      endDate: null,
      published: '',
      apiError: '',
      modal: false,
      complaintNumber: '',
      id: '',
      apiSuccess: '',
      authenticating: false,
      complaintsList: [],
      complaintsMain: [],
      searchText: '',
      fetchingDetails: false,
      fetchDetails: false,
      complaintFilterStatusOptions: [
        { label: <Translate content='all' />, value: 'All' },
        { label: <Translate content='pending' />, value: 'Pending' },
        { label: <Translate content='in progress' />, value: 'In Progress' },
        { label: <Translate content='closed' />, value: 'Closed' }
      ],

      complaintFilterStatusSelected: {
        label: <Translate content='all' />,
        value: 'All'
      },

      complaintStatusOptions: [
        { label: <Translate content='all' />, value: 'All' },
        { label: <Translate content='publish' />, value: 'Publish' },
        { label: <Translate content='unpublish' />, value: 'UnPublish' }
      ],

      complaintFilterPublishSelected: {
        label: <Translate content='all' />,
        value: 'All'
      }
    }
    this.validators = validators

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      modal: !this.state.modal,
      authenticating: false,
      apiError: ''
    })
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
    this.updateValidators([e.target.name], e.target.value)
  }

  handleSubmit (event) {
    event.preventDefault()
    // this.form.validateAll();
    this.setState({ authenticating: true })
    this.complaintNumber()

    // console.log(this.state)
  }

  updateValidators = (fieldName, value) => {
    this.validators[fieldName].errors = []
    this.validators[fieldName].state = value
    this.validators[fieldName].valid = true
    this.validators[fieldName].rules.forEach(rule => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message)
          this.validators[fieldName].valid = false
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message)
          this.validators[fieldName].valid = false
        }
      }
    })
  }

  isFormValid = () => {
    let status = true
    Object.keys(this.validators).forEach(field => {
      if (field === 'complaintNumber') {
        if (!this.validators[field].valid) {
          status = false
        }
      }
    })
    return status
  }

  displayValidationErrors = fieldName => {
    const validator = this.validators[fieldName]
    const result = ''
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className='error' key={index}>
            * {info}
            <br />
          </span>
        )
      })
      return <div className='col s12 row'>{errors}</div>
    }
    return result
  }

  componentDidMount () {
    // let selectedStatusFilters = this.props.complaintStatusFilters ? this.props.complaintStatusFilters : this.state.complaintFilterPublishSelected;
    // this.setState({ complaintFilterPublishSelected: selectedStatusFilters })
    // this.getComplaintsStatusFilter(selectedStatusFilters.value);

    let { complaintFilters } = this.props
    if (complaintFilters) {
      if (complaintFilters.status) {
        this.setState({
          complaintFilterStatusSelected: complaintFilters.status
        })
      }

      if (complaintFilters.publish) {
        this.setState({
          complaintFilterPublishSelected: complaintFilters.publish
        })
      }

      if (complaintFilters.date) {
        this.setState({ startDate: complaintFilters.date.startDate })
        this.setState({ endDate: complaintFilters.date.endDate })
      }
    }

    // let selectedStatusFilter = (this.props.complaintFilters && this.props.complaintFilters.status) ? this.props.complaintFilters.status : this.state.complaintFilterStatusSelected;
    // this.setState({ complaintFilterStatusSelected: selectedStatusFilter })
    this.getFilterComplaints(complaintFilters)
  }

  handleChange = selectedOption => {
    this.setState({ complaintFilterStatusSelected: selectedOption })
    let filters = { ...this.props.complaintFilters, status: selectedOption }
    this.props.updatingComplaintFilters(filters)
    this.getFilterComplaints(filters)
  }

  handleChange1 = selectedOptions => {
    this.setState({ complaintFilterPublishSelected: selectedOptions })
    let filters = { ...this.props.complaintFilters, publish: selectedOptions }
    this.props.updatingComplaintFilters(filters)
    this.getFilterComplaints(filters)
  }

  updateDateFilter = (startDate, endDate) => {
    let filters = {
      ...this.props.complaintFilters,
      date: { startDate, endDate }
    }
    this.props.updatingComplaintFilters(filters)
    this.getFilterComplaints(filters)
  }

  complaintNumber = status => {
    const { complaintNumber } = this.state
    this.setState({ authenticating: true })

    var thisView = this
    this.setState({ updatingStatus: true })
    axios
      .all([
        adminService.complaintNumber(
          complaintNumber,
          this.props.match.params.complaint_id,
          status
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          // let user_id = resData.data.complaintCreatedBy;
          if (resData.status && resData.data) {
            thisView.props.history.push('/complaints/' + resData.data._id)
            thisView.setState({ authenticating: false })
            // setTimeout(() => thisView.setState({ modal: false }), 2000);
          } else {
            thisView.setState({ apiError: resData.message })
            thisView.setState({ authenticating: false })
          }
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  getComplaints = status => {
    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getComplaints(status)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          let complaints = resData.data ? resData.data : []
          let complaintsList = complaints.map((eachComplaint, index) => {
            return {
              id: eachComplaint._id,
              details: {
                index: index,
                id: eachComplaint._id,
                title: eachComplaint.complaintTitle,
                description: eachComplaint.complaintDescription,
                status: eachComplaint.complaintStatus,
                date: moment(eachComplaint.createdAt).format(
                  'Do MMM YYYY hh:mm A'
                )
              }
            }
          })
          // thisView.searchInput.focus();
          thisView.setState({ complaintsList, complaintsMain: complaintsList })
        }
        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in complaint list')
      })
  }

  getFilterComplaints = filters => {
    let status =
      filters && filters.status && filters.status.value
        ? filters.status.value
        : 'All'
    let publish =
      filters && filters.publish && filters.publish.value
        ? filters.publish.value
        : 'All'
    if (publish === 'UnPublish') publish = ''
    // if(publish !== "Publish")
    //     publish = '';
    let sDate =
      filters && filters.date && filters.date.startDate
        ? moment(filters.date.startDate).format('YYYY-MM-DD')
        : null
    let eData =
      filters && filters.date && filters.date.endDate
        ? moment(filters.date.endDate).format('YYYY-MM-DD')
        : null

    var thisView = this
    thisView.setState({ fetchDetails: true })
    axios
      .all([adminService.complaintsFilter(status, publish, sDate, eData)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData.data)
          let complaints = resData.data ? resData.data : []
          let complaintsList = complaints.map((eachComplaint, index) => {
            return {
              id: eachComplaint._id,
              details: {
                index: index,
                id: eachComplaint._id,
                title: eachComplaint.complaintTitle,
                description: eachComplaint.complaintDescription,
                complaintPublish: eachComplaint.complaintPublish,
                status: eachComplaint.complaintStatus,
                date: moment(eachComplaint.createdAt).format(
                  'Do MMM YYYY hh:mm A'
                )
              }
            }
          })
          // thisView.searchInput.focus();
          thisView.setState({ complaintsList, complaintsMain: complaintsList })
        }
        thisView.setState({ fetchDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in complaint list')
      })
  }

  formatComplaint = (cell, row) => {
    return (
      <NavLink to={this.props.match.path + '/' + cell.id} className='mlac-each'>
        <div className='mlace-head'>
          <span>{cell.title}</span>
          <span className='mlacer-date'>{cell.date}</span>
          {/* <span className="mlac-complaintPublish">
                        <span className={`${cell.complaintPublish === "Publish" ? "status-Publish" : ""} ${cell.complaintPublish === "UnPublish" ? "status-unPublish" : ""}`}>{cell.complaintPublish}</span>
                    </span> */}
          <span className='mlac-status'>
            <span
              className={`${
                cell.status === 'Pending' ? 'status-pending' : ''
              } ${cell.status === 'In Progress' ? 'status-inprogress' : ''} ${
                cell.status === 'Closed' ? 'status-closed' : ''
              }`}
            >
              {cell.status}
            </span>
          </span>
        </div>
        <span className='mlace-content' sm={12}>
          {cell.description}
        </span>
      </NavLink>
    )
  }

  filterComplaints = event => {
    let searchText = this.state.searchText
    if (event) searchText = event.target.value

    let complaintsList = []
    if (searchText && searchText.length >= 2) {
      complaintsList = this.state.complaintsMain.filter(each_complaint => {
        if (
          each_complaint.details.status
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1 ||
          each_complaint.details.description
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1 ||
          each_complaint.details.title
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1
        )
          return true
        else return false
      })
    } else {
      complaintsList = this.state.complaintsMain
    }

    this.setState({ searchText, complaintsList })
  }

  DateRangePicker = () => {
    // console.log(this.state.startDate, this.state.endDate)
    // this.setState({ complaintFilterPublishSelected: selectedOption });
    // this.getComplaintsStatusFilter(selectedOption.value);
  }

  render () {
    // const { complaintStatusFilter, complaintStatusFilters, complaintFilters } = this.props;
    const { complaintFilters } = this.props

    const {
      complaintsList,
      fetchingDetails,
      fetchDetails,
      complaintFilterStatusOptions,
      complaintStatusOptions,
      complaintFilterPublishSelected,
      complaintFilterStatusSelected,
      authenticating,
      apiSuccess,
      apiError
    } = this.state
    // let selectedStatusFilter = complaintStatusFilter ? complaintStatusFilter : complaintFilterStatusSelected;
    // let selectedStatusFilters = complaintStatusFilters ? complaintStatusFilters : complaintFilterPublishSelected;

    return (
      <div className='col-span-12 mla-complaints'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>Complaints</h2>

            <Col md={4} className={'ml-auto'}>
              <div style={{ float: 'right' }}>
                <i
                  className='fa fa-refresh '
                  onClick={() => {
                    this.getFilterComplaints(complaintFilters)
                  }}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <i className='fa fa-search ' onClick={this.toggle} />
              </div>
            </Col>

            <Modal
              isOpen={this.state.modal}
              className='search-popup'
              style={{ marginTop: '50px', marginLeft: 'auto' }}
            >
              <ModalHeader
                style={{ backgroundColor: '#253c80', color: 'white' }}
                toggle={this.toggle}
              >
                <Translate content='search by complaint number' />{' '}
              </ModalHeader>
              <ModalBody>
                {apiSuccess !== '' && (
                  <div className='errormsg'>
                    <Alert color='danger'>{apiSuccess}</Alert>
                  </div>
                )}
                <Form onSubmit={this.handleSubmit}>
                  <div>
                    <label>
                      {' '}
                      <Translate content='complaint number' />{' '}
                    </label>
                    <Input
                      type='text'
                      name='complaintNumber'
                      className='input w-full border mt-2 form-control'
                      placeholder='Complaint Number'
                      // validations={[required]}
                      onChange={this.onChange}
                      value={this.state.complaintNumber}
                    />
                    {this.displayValidationErrors('complaintNumber')}
                  </div>
                  {apiError && apiError !== '' && (
                    <span className='search_error'>{apiError}</span>
                  )}
                  {!authenticating ? (
                    <Button
                      className=' btn btn-primary mt-3'
                      color='primary'
                      type='submit'
                      disabled={this.isFormValid() ? false : true}
                    >
                      <span className='text-white'>
                        <Translate content='submit' />{' '}
                      </span>
                    </Button>
                  ) : (
                    <i className='fa fa-spin fa-refresh authentication-loading' />
                  )}
                </Form>
              </ModalBody>
              {/* <ModalFooter>
                                {
                                    !authenticating ?
                                        <Button className=" btn btn-primary mt-3" color="primary" onClick={this.deleteContactHeadService}>
                                            <span className="text-white">Submit</span>
                                        </Button> :
                                        <i className="fa fa-spin fa-refresh authentication-loading" />
                                }
                            </ModalFooter> */}
            </Modal>
          </div>
        </div>

        <Row className={'intro-y'}>
          <Row className='complaint-filters'>
            <Select
              name='mlac-status-filter'
              className='selectbox mlac-status-filter w-full flex-1'
              onChange={this.handleChange}
              placeholder='Status Filter'
              options={complaintFilterStatusOptions}
              value={complaintFilterStatusSelected}
              isSearchable
              style={{ border: 'none !important' }}
              isLoading={fetchDetails}
              isDisabled={fetchDetails}
            />
            <Select
              name='mlac-status-filter'
              className='selectbox mlac-status-filter w-full flex-1'
              onChange={this.handleChange1}
              placeholder='Status Filter'
              options={complaintStatusOptions}
              value={complaintFilterPublishSelected}
              isSearchable
              style={{ border: 'none !important' }}
              isLoading={fetchDetails}
              isDisabled={fetchDetails}
            />

            <div className='date-filter'>
              <DateRangePicker
                enableOutsideDays={true}
                isOutsideRange={() => false}
                isDayHighlighted={day => day.isSame(new Date(), 'd')}
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                className='date-filter'
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                // onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                onDatesChange={({ startDate, endDate }) => {
                  this.setState({ startDate, endDate })
                  this.updateDateFilter(startDate, endDate)
                }} // PropTypes.func.isRequired,
              />
            </div>
          </Row>

          {!fetchingDetails ? (
            <Col sm md lg={12} className='mb-30'>
              <Card className='card-statistics h-100'>
                <Row className='mlac-search-container'>
                  <Col xs={12} sm={12} md={6} lg={12}>
                    <input
                      className='form-control mlac-search'
                      value={this.state.field_search_input}
                      placeholder={'Search'}
                      onChange={this.filterComplaints}
                      onKeyDown={this.filterComplaints}
                      ref={input => {
                        this.searchInput = input
                      }}
                    />
                  </Col>
                </Row>

                <CardBody>
                  <BootstrapTable
                    data={complaintsList}
                    pagination
                    striped
                    condensed
                    // search
                  >
                    <TableHeaderColumn
                      className='mlac-row'
                      dataField='details'
                      dataFormat={this.formatComplaint}
                      isKey
                    ></TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <i className='fa fa-spin fa-refresh initial_loading' />
          )}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  complaintFilters: state.auth.complaintFilters
})

const mapDispatchToProps = dispatch => ({
  updatingComplaintFilters (data) {
    dispatch(updateComplaintFilters(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Complaints)
