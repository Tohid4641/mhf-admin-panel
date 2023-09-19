import React from 'react';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import Pagination from 'react-bootstrap/Pagination'
import { connect } from 'react-redux';
import Pagination from "react-js-pagination";
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
} from 'reactstrap';
import {DebounceInput} from 'react-debounce-input';

import adminService from '../../services/adminService';
import axios from 'axios';
import moment from 'moment';
import './membership.scss';
import PageLoading from '../../elements/pageLoading/pageLoading';
import Select from 'react-select';

class Membership extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      membersList: [],
      fetchingDetails: false,
      msg: true,
      apiSuccess: '',
      modal: false,
      memberId: '',
      authenticating: false,
      options: [
        { label: 'Approved', value: 'Approved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' }
      ],
      reportOptions: [
        { label: 'Select', value: '' },
        { label: 'Daily Report', value: 'Daily' },
        { label: 'Weekly Report', value: 'Weekly' },
        { label: 'Monthly Report', value: 'Monthly' }
      ],
      selectedReport: { label: 'Select', value: '' },
      selectedStatus: { label: 'Approved', value: 'Approved' },
      skip:0, limit: 30,
      pages:{}, membersCount: 0, activePage: 0,
      searchTerm: '', exporting: false
    };

    this.membersToken = null;
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const { options } = this.state;
    this.setState({ selectedStatus: options[0] });
    this.usersListByMembershipStatus('Approved');
  }

  usersListByMembershipStatus = (status, skip=0, searchTerm='') => {
    var thisView = this;
    thisView.setState({ fetchingDetails: true });
    const details = {
      memberShipStatus: status,
      skip,
      limit: this.state.limit
    };

    if(searchTerm && searchTerm !=''){
      details.search = searchTerm;
    }

    if(this.membersToken)
      this.membersToken.cancel();
    this.membersToken = axios.CancelToken.source();

    axios
      .all([adminService.usersListByMembershipStatus(this.membersToken.token, details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let membersData = resData.data ? resData.data : [];
            // console.log(membersData);
            let membersCount = membersData.membersCount ? membersData.membersCount : 0;
            let membersList = membersData.members ? membersData.members : [];
            membersList = membersList.map((eachMember, index) => {

              let expired = false;
              if(eachMember && eachMember.expiryDate){
                let expireIn = moment(moment(eachMember.expiryDate)).diff(new Date(), "days");
                if(expireIn < 0){
                  expired = true;
                }
              }

              return {
                ...eachMember,
                id: eachMember._id,
                sNo: skip + index + 1,
                statusMember: 'Pending',
                expired: expired ? "Yes" : ""
              };
            });
            let activePage = 0;
            if(membersCount !== 0 && skip !== 0){
              activePage = parseInt(skip / thisView.state.limit);
            } 
              
            let pages = thisView.state.pages;
            pages["page_"+activePage] = membersList;
            thisView.setState({ membersList, membersCount, pages, activePage });

            thisView.setState({ Success_msg: '' });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
        thisView.setState({ fetchingDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  };
  renewPlan = (cell, row) => {
    return (
      <div className='mlace-head'>
        <NavLink
          className='review-btn btn'
          to={this.props.match.path + '/renew/' + row.id}
        >
          Renew
        </NavLink>
      </div>
    );
  };
  uploadFormatter = (cell, row) => {
    return (
      <div className='mlace-head'>
        {/* <Button className='approve-btn mr-2'>Approve</Button> */}
        {/* <Button className='reject-btn mr-2'>Reject</Button> */}
        {row.email && (
          <>
            <span
              className={`member-status mr-2 ${
                row.memberShipStatus ? row.memberShipStatus.toLowerCase() : ''
              }`}
            >
              {row.memberShipStatus}
            </span>
            <NavLink
              className='review-btn mr-3 btn'
              to={this.props.match.path + '/' + row._id}
            >
              {row.memberShipStatus === 'Pending' ? ' Review' : 'Details'}
            </NavLink>
          </>
        )}
      </div>
    );
  };

  formateCreatedOn = (cell, row) => {
    return (
      <div className='mlace-head'>
        {/* <Button className='approve-btn mr-2'>Approve</Button> */}
        {/* <Button className='reject-btn mr-2'>Reject</Button> */}
        {row.createdAt && (
          <span>{moment(new Date()).diff(moment(row.createdAt), 'days') === 0 ? "Today" : ( moment(new Date()).diff(moment(row.createdAt), 'days') === 1 ? moment(new Date()).diff(moment(row.createdAt), 'day') + " Day" : moment(new Date()).diff(moment(row.createdAt), 'day') + " Days")}</span>  
        )}
      </div>
    );
  }

  formateRenew = (cell, row) => {
    return (
      <div className='mlace-head'>
        {/* <Button className='approve-btn mr-2'>Approve</Button> */}
        {/* <Button className='reject-btn mr-2'>Reject</Button> */}
        { row.renewal ? "Yes" : "" }
      </div>
    );
  }

  deleteMember = () => {
    var thisView = this;
    thisView.setState({ authenticating: true, msg: !this.state.msg });
    const { memberId } = this.state;
    this.setState({ authenticating: true });
    axios
      .all([adminService.deleteMember(memberId)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            thisView.setState({ apiSuccess: 'Member deleted successfully ' });

            setTimeout(() => window.location.reload(), 2000);
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ authenticating: false });
        // setTimeout(() => window.location.reload(), thisView.setState({ modal: false }), 4000);
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Member');
      });
  };
  updateContact = (row, cell) => {
    return (
      <NavLink to={this.props.match.path + '/update/' + row.id}>{cell}</NavLink>
    );
  };

  formatName = (cell, row) => {
    return (
      <NavLink to={this.props.match.path + '/card/' + row._id}>{cell}</NavLink>
    );
  };
  displayDate = (cell, row) => {
    return <p>{cell ? moment(cell).format('DD/MM/YYYY') : ''}</p>;
  };
  toggle(id) {
    if (id) {
      this.setState({ memberId: id });
    }
    this.setState({
      modal: !this.state.modal
    });
  }
  onStatusSelected = (selectedStatus) => {
    this.setState({
      selectedStatus,
      skip: 0
    }, () => {
      this.usersListByMembershipStatus(selectedStatus.value, 0, this.state.searchTerm);
    });
    
  };

  

  paginationClicked = (page) => {
    console.log(page);
    if(this.state.pages && this.state.pages["page_"+(page-1)]){
      console.log(this.state.pages);
      this.setState({membersList: this.state.pages["page_"+(page-1)], activePage: page-1});
    } else {
      this.setState({skip: this.state.limit*(page-1)});
      this.usersListByMembershipStatus(this.state.selectedStatus.value, this.state.limit*(page-1), this.state.searchTerm);
    }
    
  }

  searchMember = (searchTerm) => {
    console.log(searchTerm);
    this.setState({skip: 0, searchTerm}, () => {
      this.usersListByMembershipStatus(this.state.selectedStatus.value, 0, searchTerm);
    });
    
  }

  exportMembers = () => {

    var thisView = this;
    thisView.setState({ exporting: true });
    const details = {
      memberShipStatus: this.state.selectedStatus.value
    };

    if(this.state.searchTerm && this.state.searchTerm !=''){
      details.search = this.state.searchTerm;
    }

    axios
      .all([adminService.exportMembersList(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let membersData = resData.data ? resData.data : [];
            window.open(thisView.props.config.projectPath+"exports/"+membersData.file, '_blank').focus();
          } else {
            thisView.setState({ apiError: resData });
          }
        }
        thisView.setState({ exporting: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  }

  render() {
    const { match } = this.props;
    const {
      fetchingDetails,
      authenticating,
      apiSuccess,
      membersList,
      options,
      reportOptions,
      selectedReport,
      selectedStatus,
      skip,
      exporting
    } = this.state;

    const onSelectReport = (selectedReport) => {
      this.setState({selectedReport})
    }

    console.log(membersList)
    const filtered = membersList.filter((eachMember)=>{
      // if(eachMember && eachMember.createdAt){
        let diff = moment(moment(eachMember.createdAt)).diff(new Date(), "days");
        console.log(diff)
        console.log(this.state.selectedReport)
        if(this.state.selectedReport.value == 'Daily' && diff == 0){
          console.log('daily execute in filter')
          return eachMember
        }
        if(this.state.selectedReport.value == 'Weekly' && diff == -6){
          console.log('weekly execute in filter')
          return eachMember
        }
        if(this.state.selectedReport.value == 'Monthly' && diff == -29){
          console.log('monthly execute in filter')
          return eachMember
        }
        // else{
        //   console.log('else execute in map')
        //   return eachMember
        // }
      }
    // })
    )
    console.log('filtered',filtered)
    // if(filtered!=[]){
    //   this.state.membersList(filtered)
    // }


    // console.log(membersList)
    // console.log('reportOptions',reportOptions)
    // console.log('selectedReport',selectedReport)

    return (
      <div className='col-span-12 membership'>
        <div className='intro-y col-span-12'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>Membership</h2>
            <div className='membership-search-box'>
              <DebounceInput
                placeholder="Search"
                minLength={3}
                debounceTimeout={300}
                onChange={event => { this.searchMember(event.target.value) }} /> 
            </div>
            <div className='select-report'>
              <Select
                name=''
                className='selectbox mr-5 ml-2'
                isSearchable
                style={{ border: 'none !important' }}
                onChange={onSelectReport}
                placeholder={'Select Report  '}
                options={reportOptions}
                value={selectedReport}
              />
            </div>
            <div className='ml-auto flex header-section-width'>
              
              <Select
                name=''
                className='selectbox mr-3'
                isSearchable
                style={{ border: 'none !important' }}
                onChange={this.onStatusSelected}
                placeholder={'Select Status  '}
                options={options}
                value={selectedStatus}
              />
              <NavLink to={match.path + '/add'} className=' btn custom-btn'>
                {' '}
                Add
              </NavLink>
              <span className=' btn custom-btn export-button' onClick={this.exportMembers}>
                {' '}
                Export
                {
                  exporting &&
                  <div className='loading-img'>
                    <i className='fa fa-spin fa-refresh' />
                  </div>
                }
                
              </span>
            </div>
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
                  onClick={this.toggle}
                >
                  <span className='text-white'> Delete</span>
                </Button>
              ) : (
                <i className='fa fa-spin fa-refresh authentication-loading' />
              )}
            </ModalFooter>
          </Modal>
          {/* main body */}
          <Row className={'intro-y'}>
            {
              // !fetchingDetails && 
              (
              <>
              <Col sm md lg={12} className='mb-30'>
                <Card className='card-statistics h-100'>
                  <CardBody>
                    <BootstrapTable
                      data={membersList}
                      // pagination
                      striped
                      condensed
                      // search
                    >
                      <TableHeaderColumn width='40' dataField='sNo' isKey>
                        {' '}
                        SNo
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataField='name'
                        dataFormat={this.formatName}
                      >
                        {' '}
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width='120' dataField='email'>
                        {' '}
                        Email
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='mobileNo'>
                        {' '}
                        Mobile Number
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataField='dateOfBirth'
                        dataFormat={this.displayDate}
                      >
                        {' '}
                        Date of Birth
                      </TableHeaderColumn>
                      <TableHeaderColumn width='80' dataField='maritalStatus'>
                        {' '}
                        Marital Status
                      </TableHeaderColumn>
                      <TableHeaderColumn width='80' dataField='expired'>
                        {' '}
                        Expired
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='120'
                        dataFormat={this.formateCreatedOn}
                      >
                        Created On
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='120'
                        dataFormat={this.uploadFormatter}
                      >
                        Actions
                      </TableHeaderColumn>

                    </BootstrapTable>
                  </CardBody>
                </Card>
              </Col>
              <Pagination
                activePage={this.state.activePage+1}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={this.state.membersCount}
                pageRangeDisplayed={10}
                itemClass='page-item'
                linkClass='page-link'
                onChange={this.paginationClicked}
                firstPageText={"First"}
                prevPageText={"Prev"}
                nextPageText={"Next"}
                lastPageText={"Last"}
              />
            </>
              
            )}
            {
              fetchingDetails &&
              <PageLoading />
            }
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.auth.config
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Membership);
