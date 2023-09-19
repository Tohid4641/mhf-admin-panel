import React from 'react';
import './hospitalDetails.scss';
import { Label, Button } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import adminService from '../../services/adminService';
import PageLoading from '../../elements/pageLoading/pageLoading';
class HospitalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hospitalDetails: {
        _id: '1',
        name: 'Test',
        address: 'Hyderabad',
        about: 'Testing',
        services: [
          { serviceName: 'Test Service 1', _id: '1' },
          { serviceName: 'Test Service 2', _id: '2' },
          { serviceName: 'Test Service 3', _id: '3' },
          { serviceName: 'Test Service 4', _id: '4' }
        ]
      },
      fetchingDetails: false
    };
  }

  componentDidMount() {
    const id = this.props.match.params.hospitalId;
    if (id) {
      this.getHospitalDetails(id);
    }
  }
  getHospitalDetails = (hospitalId) => {
    var thisView = this;
    thisView.setState({ fetchingDetails: true });
    let details = {
      hospital_id: hospitalId
    };
    axios
      .all([adminService.getHospitalDetails(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let hospitalDetails = resData.data ? resData.data : {};
            hospitalDetails.list_of_services_the_hospital_provides =
              hospitalDetails.list_of_services_the_hospital_provides &&
              hospitalDetails.list_of_services_the_hospital_provides
                ? JSON.parse(
                    hospitalDetails.list_of_services_the_hospital_provides
                  )
                : [];
            console.log(hospitalDetails);
            thisView.setState({ hospitalDetails });
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

  updateHospital = (e, cell) => {
    e.preventDefault()

    const { match } = this.props
    let id = match.params.hospitalId
    let url = match.url
    url = url.replace(id, 'update/' + id)
    this.props.history.push(url)
  }

  render() {
    const { hospitalDetails, fetchingDetails } = this.state;
    return (
      <div className='col-span-12 hospital-details'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            {!fetchingDetails ? (
              <div className='intro-y box'>
                <div className='flex flex-col sm:flex-row items-center pl-5 p-2 border-b border-gray-200'>
                  <h2 className='font-medium text-base mr-auto'>
                    Hospital Detail
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
                          onClick={this.updateHospital}
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
                      <th> Hospital Name</th>
                      <td>
                        {hospitalDetails.name_of_hospital
                          ? hospitalDetails.name_of_hospital
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Address</th>
                      <td>
                        {hospitalDetails.address_of_hospital
                          ? hospitalDetails.address_of_hospital
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Contact</th>
                      <td>
                        {hospitalDetails.contact
                          ? hospitalDetails.contact
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> What Kind Of Hospital</th>
                      <td>
                        {hospitalDetails.what_kind_of_hospital
                          ? hospitalDetails.what_kind_of_hospital
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th> Timings Of Hospital</th>
                      <td>
                        {hospitalDetails.timings_of_hospital
                          ? hospitalDetails.timings_of_hospital
                          : 'NA'}
                      </td>
                    </tr>
                    <tr>
                      <th>About</th>
                      <td>
                        {hospitalDetails.about_the_hospital
                          ? hospitalDetails.about_the_hospital
                          : 'NA'}
                      </td>
                    </tr>
                  </table>

                  {hospitalDetails.list_of_services_the_hospital_provides &&
                    hospitalDetails.list_of_services_the_hospital_provides
                      .length > 0 && (
                      <>
                        <Label className='label-name section-heading padding-top'>
                          Hopital Services
                        </Label>
                        <table class='data mb-3'>
                          {hospitalDetails.list_of_services_the_hospital_provides &&
                            hospitalDetails
                              .list_of_services_the_hospital_provides.length >
                              0 &&
                            hospitalDetails.list_of_services_the_hospital_provides.map(
                              (eachService, index) => {
                                return (
                                  <>
                                    <tr key={index}>
                                      <th> Service</th>
                                      <td>
                                        {eachService ? eachService : 'NA'}
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            )}
                        </table>
                      </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(HospitalDetails);
