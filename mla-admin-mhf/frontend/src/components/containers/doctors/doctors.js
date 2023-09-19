import React from 'react';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Col, Card, CardBody, Button, Modal, ModalBody } from 'reactstrap';
import adminService from '../../services/adminService';
import axios from 'axios';
import './doctors.scss';
import PageLoading from '../../elements/pageLoading/pageLoading';
import { VscClose } from 'react-icons/vsc';

class Doctors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doctorList: [],
      fetchingDetails: false,
      msg: true,
      apiSuccess: '',
      modal: false,
      doctorId: '',
      deleteDetail: false
    };
  }
  componentDidMount() {
    this.getDoctorsList('refresh');
  }

  getDoctorsList = (refresh) => {
    var thisView = this;
    if (refresh === 'refresh') thisView.setState({ fetchingDetails: true });
    const details = {
      status: 'ACTIVE'
    };
    axios
      .all([adminService.getDoctorsList(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let doctorList = resData.data ? resData.data : [];
            console.log(doctorList);
            doctorList = doctorList.map((eachDoctor, index) => {
              return {
                ...eachDoctor,
                id: eachDoctor._id,
                sNo: 1 + index
              };
            });
            thisView.setState({ doctorList });
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
  uploadFormatter = (cell, row) => {
    return (
      <div className='mlace-head'>
        <NavLink
          className='review-btn btn'
          to={this.props.match.path + '/' + row._id}
        >
          Details
        </NavLink>
        {/* <NavLink
          className='next-btn mr-3 btn'
          to={this.props.match.path + '/update/' + row._id}
        >
          Update
        </NavLink> */}
        <Button
          className='reject-btn btn'
          onClick={() => this.deleteModel(row._id)}
        >
          Delete
        </Button>
      </div>
    );
  };

  deleteDoctor = () => {
    var thisView = this;
    thisView.setState({ deleteDetail: true, msg: !this.state.msg });
    const { doctorId } = this.state;
    let details = {
      doctor_id: doctorId,
      status: 'INACTIVE'
    };
    axios
      .all([adminService.deleteDoctor(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            // thisView.setState({ apiSuccess: 'Doctor Deleted successfully ' });
            thisView.getDoctorsList(false);
            thisView.deleteModel();
            // setTimeout(() => window.location.reload(), 2000);
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ deleteDetail: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Doctor');
      });
  };
  deleteModel = (id) => {
    if (id) {
      this.setState({ doctorId: id });
    } else {
      this.setState({ doctorId: '' });
    }
    this.setState({
      toggleDeleteModel: !this.state.toggleDeleteModel
    });
  };

  render() {
    const { match } = this.props;
    const { fetchingDetails, deleteDetail, doctorList, toggleDeleteModel } =
      this.state;

    return (
      <div className='col-span-12 doctors'>
        <div className='intro-y col-span-12'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>Doctors</h2>
            <NavLink
              to={match.path + '/add'}
              className='ml-auto flex btn custom-btn'
            >
              {' '}
              Add
            </NavLink>
          </div>

          <Row className={'intro-y'}>
            {!fetchingDetails ? (
              <Col sm md lg={12} className='mb-30'>
                <Card className='card-statistics h-100'>
                  <CardBody>
                    <BootstrapTable
                      data={doctorList}
                      pagination
                      striped
                      condensed
                      search
                    >
                      <TableHeaderColumn width='40' dataField='sNo' isKey>
                        {' '}
                        SNo
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='name_of_doctor'>
                        {' '}
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='contact'>
                        {' '}
                        Contact
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        // width='100'
                        dataField='list_of_hospitals_working'
                      >
                        {' '}
                        Hospital Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width='100'
                        dataFormat={this.uploadFormatter}
                      >
                        Actions
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              <PageLoading />
            )}
          </Row>

          <Modal isOpen={toggleDeleteModel} className='add-modal'>
            <ModalBody style={{ backgroundColor: '#fff' }}>
              <div className=''>
                <div className='col-span-12'>
                  <Row className='lg-close'>
                    <h1 className='header-text'>Delete </h1>
                    <VscClose
                      className='close-icon'
                      onClick={() => this.deleteModel()}
                    />
                  </Row>
                  <p className='mt-3 py-4'>
                    Are you sure you want to delete this Doctor
                  </p>
                  <Row>
                    <Col className='add-button text-right'>
                      {deleteDetail ? (
                        <Button
                          className='update-button mr-3 '
                          color='primary'
                          disabled
                        >
                          <i className='fa fa-spin fa-refresh submit-loading' />
                        </Button>
                      ) : (
                        <Button
                          className='update-button mr-3'
                          color='primary'
                          onClick={() => this.deleteDoctor()}
                        >
                          <span className='text-white'> Delete </span>
                        </Button>
                      )}

                      <Button
                        className='close-button'
                        color='primary'
                        onClick={() => this.deleteModel()}
                      >
                        <span className='text-white'> Close </span>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Doctors;
