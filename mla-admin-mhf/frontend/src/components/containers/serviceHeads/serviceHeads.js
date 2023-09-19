import React from 'react'
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
import adminService from '../../services/adminService'
import axios from 'axios'

import Translate from 'react-translate-component'

import './serviceHeads.scss'

class ServiceHeads extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      serviceHeadsList: [],
      // contactsMain:[],
      fetchingDetails: false,
      apiSuccess: '',
      msg: true,
      modal: false,
      contactid: '',
      authenticating: false
    }
    this.toggle = this.toggle.bind(this)
  }
  componentDidMount () {
    this.getServiceHeads(this.props.match.id)
  }

  getServiceHeads = contactNumberId => {
    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.headOfServiceList(contactNumberId)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData.data)
          if (resData.status) {
            if (resData.data) {
              let serviceHeadsList = resData.data.map(
                (eachServiceHeads, index) => {
                  return {
                    id: eachServiceHeads._id,
                    sNo: index,
                    firstName: eachServiceHeads.firstName,
                    role: eachServiceHeads.role,
                    mobileNo: eachServiceHeads.mobileNo,
                    email: eachServiceHeads.email
                  }
                }
              )
              thisView.setState({ serviceHeadsList })
            }

            thisView.setState({ Success_msg: '' })
          } else {
            thisView.setState({ apiError: resData })
          }
        }
        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  toggle (id) {
    if (id) {
      this.setState({ contactid: id })
    }
    this.setState({
      modal: !this.state.modal
    })
  }

  deleteContactHeadService = () => {
    var thisView = this

    thisView.setState({ authenticating: true, msg: !this.state.msg })

    let insertType = ''
    // let id = this.props.match.params.contact_id;
    if (this.props.location.pathname.indexOf('serviceheads') > -1) {
      insertType = 'headOfService'
      //   let  contactid = this.props.match.params.serviceheads_id;
    }

    this.setState({ authenticating: true })
    axios
      .all([
        adminService.deleteContactHeadService(this.state.contactid, insertType)
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({ apiSuccess: 'Contact deleted successfully ' })

            // if (insertType === "")
            //     thisView.props.history.push("/contacts");
            // else if (insertType === "headOfService")
            //     thisView.props.history.push("/serviceheads");
            // thisView.props.history.push("/contacts");
            setTimeout(() => window.location.reload(), 2000)
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
        // setTimeout(() => thisView.setState({ modal: false }), 2000);
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  uploadFormatter = (cell, row) => {
    return (
      <div className='mlace-head'>
        <NavLink to={this.props.match.path + '/update/' + row.id}>
          <i className='fa fa-edit mlac-edit' />
        </NavLink>
        &nbsp;&nbsp;&nbsp;
        <i
          className='fa fa-trash mlac-delete'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            this.toggle(row.id)
          }}
        />
      </div>
    )
  }

  updateContact = (row, cell) => {
    return <NavLink to={this.props.match.path + '/' + row.id}>{cell}</NavLink>
  }

  formatName = (cell, row) => {
    return <NavLink to={this.props.match.path + '/' + row.id}>{cell}</NavLink>
  }

  render () {
    const { match } = this.props
    const { fetchingDetails, apiSuccess, authenticating } = this.state
    // console.log(this.state.contacts);

    return (
      <div className='col-span-12 mla-serviceheads'>
        <div className='intro-y col-span-12'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='serviceHeads' />
            </h2>
            <NavLink to={match.path + '/add'} className='ml-auto flex '>
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
                <p>Are you sure you want to delete this contact</p>
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
                  onClick={this.deleteContactHeadService}
                >
                  <span className='text-white'>
                    <Translate content='delete' />
                  </span>
                </Button>
              ) : (
                <i className='fa fa-spin fa-refresh authentication-loading' />
              )}
            </ModalFooter>
          </Modal>
          {/* main body */}
          <Row className={'intro-y'}>
            {!fetchingDetails ? (
              <Col sm md lg={12} className='mb-30'>
                <Card className='card-statistics h-100'>
                  <CardBody>
                    <BootstrapTable
                      data={this.state.serviceHeadsList}
                      pagination
                      striped
                      condensed
                      search
                    >
                      <TableHeaderColumn width='50' dataField='sNo' isKey>
                        <Translate content='sNo' />
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataField='firstName'
                        dataFormat={this.formatName}
                      >
                        <Translate content='name' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='role'>
                        <Translate content='designation' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='mobileNo'>
                        <Translate content='contact no' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='email'>
                        <Translate content='email' />
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
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
      </div>
    )
  }
}
export default ServiceHeads
