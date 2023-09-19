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

import './contacts.scss'

class Contacts extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      contacts: [],
      // contactsMain:[],
      fetchingDetails: false,
      msg: true,
      apiSuccess: '',
      modal: false,
      contactid: '',
      authenticating: false
    }

    this.toggle = this.toggle.bind(this)
  }
  componentDidMount () {
    this.getContacts(this.props.match.id)
  }

  getContacts = contactNumberId => {
    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getContactList('Event', contactNumberId)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (resData.data) {
              let contacts = resData.data.map((eachEvent, index) => {
                return {
                  id: eachEvent._id,
                  sNo: index,
                  firstName: eachEvent.firstName,
                  role: eachEvent.role,
                  mobileNo: eachEvent.mobileNo,
                  email: eachEvent.email
                }
              })
              thisView.setState({ contacts })
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

  deleteContactHeadService = () => {
    var thisView = this
    thisView.setState({ authenticating: true, msg: !this.state.msg })

    let insertType = ''
    // let id = this.props.match.params.contact_id;
    // let contactid = this.props.match.id;
    if (this.props.location.pathname.indexOf('serviceheads') > -1) {
      insertType = 'headOfService'
      //  let   contactid = this.props.match.params.serviceheads_id;
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

            // setTimeout(() => window.location.reload(), thisView.props.history.push("/contacts"), window.location.reload(), 4000);
            setTimeout(() => window.location.reload(), 2000)
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

  updateContact = (row, cell) => {
    return (
      <NavLink to={this.props.match.path + '/update/' + row.id}>{cell}</NavLink>
    )
  }

  formatName = (cell, row) => {
    return <NavLink to={this.props.match.path + '/' + row.id}>{cell}</NavLink>
  }

  toggle (id) {
    if (id) {
      this.setState({ contactid: id })
    }
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    const { match } = this.props
    const { fetchingDetails, authenticating, apiSuccess } = this.state
    // console.log(this.state.contacts);

    return (
      <div className='col-span-12 mla-contacts'>
        <div className='intro-y col-span-12'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='contact' />
            </h2>
            <NavLink to={match.path + '/add'} className='ml-auto flex '>
              {' '}
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
                  <Translate content='are you sure you want to delete this contact' />
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
                  onClick={this.deleteContactHeadService}
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
          {/* main body */}
          <Row className={'intro-y'}>
            {!fetchingDetails ? (
              <Col sm md lg={12} className='mb-30'>
                <Card className='card-statistics h-100'>
                  <CardBody>
                    <BootstrapTable
                      data={this.state.contacts}
                      pagination
                      striped
                      condensed
                      search
                    >
                      <TableHeaderColumn width='50' dataField='sNo' isKey>
                        {' '}
                        <Translate content='sNo' />
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataField='firstName'
                        dataFormat={this.formatName}
                      >
                        {' '}
                        <Translate content='name' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='role'>
                        {' '}
                        <Translate content='designation' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='mobileNo'>
                        {' '}
                        <Translate content='contact no' />
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='email'>
                        {' '}
                        <Translate content='email' />
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataFormat={this.uploadFormatter}
                      >
                        {' '}
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
export default Contacts
