import React from 'react'
import './users.scss'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Row, Col, Card, CardBody } from 'reactstrap'
import adminService from '../../services/adminService'
import axios from 'axios'

import Translate from 'react-translate-component'

class Users extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userList: [],
      userMain: [],
      fetchingDetails: false
    }
  }

  componentDidMount () {
    this.getUserList()
  }

  getUserList = () => {
    var thisView = this
    thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.userList()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData.data)
          if (resData.status) {
            if (resData.data) {
              let userList = resData.data.map((eachUser, index) => {
                return {
                  sNo: index,
                  fullName: eachUser.fullName,
                  voterId: eachUser.voterId,
                  userAddress: eachUser.userAddress,
                  mobileNo: eachUser.mobileNo
                  // status : eachUser.status
                }
              })
              thisView.setState({ userList, userMain: userList })
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

  render () {
    const { userList, fetchingDetails } = this.state

    return (
      <div className='col-span-12 mla-users'>
        <div className='intro-y col-span-12'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='users' />
            </h2>
            {/* <NavLink to={match.path + "/add"} className="ml-auto flex text-theme-1 "> <Translate content="add" /> </NavLink> */}
          </div>
          {/* main body */}
          <Row className={'intro-y'}>
            {!fetchingDetails ? (
              <Col sm md lg={12} className='mb-30'>
                <Card className='card-statistics h-100'>
                  <CardBody>
                    <BootstrapTable
                      data={userList}
                      pagination
                      striped
                      condensed
                      search
                    >
                      {/* <TableHeaderColumn width='100' dataField='sNo' isKey>S.No</TableHeaderColumn>   */}
                      <TableHeaderColumn width='100' dataField='fullName' isKey>
                        {' '}
                        <Translate content='name' />{' '}
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='voterId'>
                        {' '}
                        <Translate content='voter id' />{' '}
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='userAddress'>
                        {' '}
                        <Translate content='address' />{' '}
                      </TableHeaderColumn>
                      {/* <TableHeaderColumn width='100' dataField='status'> Status</TableHeaderColumn> */}
                      <TableHeaderColumn width='100' dataField='mobileNo'>
                        {' '}
                        <Translate content='contact no' />{' '}
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
export default Users
