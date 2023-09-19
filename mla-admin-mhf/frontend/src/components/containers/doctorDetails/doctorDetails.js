import React from 'react';
import './doctorDetails.scss';
import { Button } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import adminService from '../../services/adminService';
import PageLoading from '../../elements/pageLoading/pageLoading';
class DoctorDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doctorDetails: {},
      fetchingDetails: false
    };
  }

  componentDidMount() {
    const id = this.props.match.params.doctorId;
    if (id) {
      this.getDoctorDetails(id);
    }
  }
  getDoctorDetails = (doctorId) => {
    var thisView = this;
    thisView.setState({ fetchingDetails: true });
    let details = {
      doctor_id: doctorId
    };
    axios
      .all([adminService.getDoctorDetails(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let doctorDetails = resData.data ? resData.data : {};
            console.log(doctorDetails);
            thisView.setState({ doctorDetails });
          } else {
            thisView.setState({ apiError: resData });
          }
          thisView.setState({ fetchingDetails: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message)
          console.log('An error occurred in Get Hospital Detail');
      });
  };

  updateDoctor = (e) => {
    e.preventDefault()

    const { match } = this.props
    let id = match.params.doctorId
    let url = match.url
    url = url.replace(id, 'update/' + id)
    this.props.history.push(url)
  }

  render() {
    const { doctorDetails, fetchingDetails } = this.state;
    return (
      <div className='col-span-12 doctor-details'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            {!fetchingDetails ? (
              <div className='intro-y box'>
                <div className='flex flex-col sm:flex-row items-center pl-5 p-2 border-b border-gray-200'>
                  <h2 className='font-medium text-base mr-auto'>
                    Doctor Detail
                  </h2>
                  <div className='edit-event-icon flex items-center text-gray-700 sm:ml-auto sm:mt-0 pr-2'>
                    <div className='intro-y flex relative pt-16 sm:pt-6 items-center pb-6'>
                      <div className='absolute sm:relative -mt-12 sm:mt-0 w-full flex text-gray-700 text-xs sm:text-sm'></div>
                      {/* <a href="" className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share"> <i className="fa fa-share-alt" aria-hidden="true"></i></a> */}
                      <div className='event-btn'>
                        {/* <Button className="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip" title="Share" onClick={this.addevent}>
                                              <i className="fa fa-share-alt" aria-hidden="true"></i></Button> */}
                        <Button
                          className='intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip'
                          title='Share'
                          onClick={this.updateDoctor}
                        >
                          <i className='fa fa-edit mlac-edit' aria-hidden='true'></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='p-5'>
                  <table class='data'>
                    <tr>
                      <th> Name</th>
                      <td>
                        {doctorDetails.name_of_doctor
                          ? doctorDetails.name_of_doctor
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Hospital Name</th>
                      <td>
                        {doctorDetails.list_of_hospitals_working
                          ? doctorDetails.list_of_hospitals_working
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Contact </th>
                      <td>
                        {doctorDetails.contact
                          ? doctorDetails.contact
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Designation</th>
                      <td>
                        {doctorDetails.designation
                          ? doctorDetails.designation
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Qualification</th>
                      <td>
                        {doctorDetails.qualification
                          ? doctorDetails.qualification
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th>About</th>
                      <td>
                        {doctorDetails.about_doctor
                          ? doctorDetails.about_doctor
                          : 'NA'}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            ) : (
              <PageLoading />
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  config: state.auth.config
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorDetails);
