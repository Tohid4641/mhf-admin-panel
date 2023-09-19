import React from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
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
import './departments.scss'

import adminService from '../../services/adminService'

import Translate from 'react-translate-component'

class Events extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      departmentList: [],
      departmentsMain: [],
      fetchingDetails: false,
      msg: true,
      apiSuccess: '',
      modal: false,
      departmentId: '',
      authenticating: false
    }
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount () {
    this.getDepartments()
  }

  getDepartments = () => {
    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getDepartments()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (resData.data) {
              let departmentList = resData.data.map((eachDepartment, index) => {
                return {
                  sNo: index,
                  id: eachDepartment._id,
                  departmentName: eachDepartment.departmentName
                }
              })
              thisView.setState({
                departmentList,
                departmentsMain: departmentList
              })
            }
            thisView.setState({ fetchingDetails: false })
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

  deleteDepartment = () => {
    var thisView = this
    thisView.setState({ authenticating: true, msg: !this.state.msg })

    this.setState({ authenticating: true })
    axios
      .all([adminService.deleteDepartment(this.state.departmentId)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({
              apiSuccess: 'Department deleted successfully '
            })

            setTimeout(() => window.location.reload(), 2000)
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in departments')
      })
  }

  uploadFormatter = (cell, row) => {
    return (
      <div className='mlace-head'>
        <NavLink
          to={this.props.match.path + '/update/' + row.id}
          className='mlac-each'
        >
          <i className='fa fa-edit mlac-edit' />
        </NavLink>

        <i
          className='fa fa-trash mlac-delete ml-2'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            this.toggle(row.id)
          }}
        />
      </div>
    )
  }

  toggle (id) {
    if (id) {
      this.setState({ departmentId: id })
    }
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    const { match } = this.props
    const {
      departmentList,
      fetchingDetails,
      authenticating,
      apiSuccess
    } = this.state

    return (
      <div className='col-span-12 mla-department'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='departments' />
            </h2>
            <NavLink
              to={match.path + '/add'}
              className='ml-auto flex text-theme-1'
            >
              <Translate content='add' />
            </NavLink>
          </div>
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
                <p>
                  A{' '}
                  <Translate content='are you sure you want to delete this department' />
                </p>
              )}
              {apiSuccess && (
                <div className='errormsg'>
                  <Alert color='success'>{apiSuccess}</Alert>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {!authenticating ? (
                <Button
                  className=' btn btn-primary '
                  color='danger'
                  onClick={this.deleteDepartment}
                >
                  <span className='text-white'>
                    {' '}
                    <Translate content='delete' />
                  </span>
                </Button>
              ) : (
                <i className='fa fa-spin fa-refresh authentication-loading' />
              )}
            </ModalFooter>
          </Modal>
        </div>

        <Row className={'intro-y'}>
          {!fetchingDetails ? (
            <Col sm md lg={12} className='mb-30'>
              <Card className='card-statistics h-100'>
                <CardBody>
                  <BootstrapTable
                    data={departmentList}
                    pagination
                    striped
                    condensed
                    search
                  >
                    <TableHeaderColumn width='100' dataField='sNo' isKey>
                      <Translate content='sNo' />
                    </TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='departmentName'>
                      <Translate content='department name' />
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      width='50'
                      dataFormat={this.uploadFormatter}
                    >
                      <Translate content='update' />
                    </TableHeaderColumn>
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
export default Events
