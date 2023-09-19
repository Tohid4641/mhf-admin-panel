import React from 'react';
import './home.scss';
import axios from 'axios';
import adminService from '../../services/adminService';
import PageLoading from '../../elements/pageLoading/pageLoading';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allData: {},
      doctorCount: '0',
      hospitalCount: '0',
      eventsCount: '0',
      memberCountRejected: '0',
      memberCountApproved: '0',
      memberCountPending: '0'
    };
  }

  componentDidMount() {
    this.getStats('refresh');
  }

  getStats = (refresh) => {
    var thisView = this;
    if (refresh === 'refresh') thisView.setState({ fetchingData: true });
    axios
      .all([adminService.getStats()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let allData = resData.data ? resData.data : {};
            let doctorCount = allData && allData.doctors ? allData.doctors : [];
            doctorCount = doctorCount.map((eachCount, index) => {
              if (eachCount && eachCount._id === 'ACTIVE') {
                thisView.setState({ doctorCount: eachCount.count });
              }
              return {
                ...eachCount,
                sNo: 1 + index
              };
            });

            let hospitalCount =
              allData && allData.hospitals ? allData.hospitals : [];
            hospitalCount = hospitalCount.map((eachCount, index) => {
              if (eachCount && eachCount._id === 'ACTIVE') {
                thisView.setState({ hospitalCount: eachCount.count });
              }
              return {
                ...eachCount,
                sNo: 1 + index
              };
            });

            let eventsCount = allData && allData.events ? allData.events : [];
            eventsCount = eventsCount.map((eachCount, index) => {
              if (eachCount && eachCount._id === 'Event') {
                thisView.setState({ eventsCount: eachCount.count });
                console.log(eachCount);
              }
              return {
                ...eachCount,
                sNo: 1 + index
              };
            });

            let usersCount =
              allData && allData.memberShip ? allData.memberShip : [];
            usersCount = usersCount.map((eachCount, index) => {
              if (eachCount && eachCount._id === 'Rejected') {
                thisView.setState({ memberCountRejected: eachCount.count });
              }
              if (eachCount && eachCount._id === 'Approved') {
                thisView.setState({ memberCountApproved: eachCount.count });
              }
              if (eachCount && eachCount._id === 'Pending') {
                thisView.setState({ memberCountPending: eachCount.count });
              }
              return {
                ...eachCount,
                sNo: 1 + index
              };
            });
            thisView.setState({ Success_msg: '' });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
        thisView.setState({ fetchingData: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Fetch Counts');
      });
  };
  render() {
    const {
      allData,
      fetchingData,
      doctorCount,
      hospitalCount,
      eventsCount,
      memberCountRejected,
      memberCountApproved,
      memberCountPending
    } = this.state;
    return (
      <div className='col-span-12 mla-home'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10'>
            <h2 className='text-lg text-black font-medium'>
              <Translate content='reports' />
            </h2>
          </div>
          <div className='intro-y grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5'>
            {!fetchingData ? (
              <>
                <Link to={'/membership'} className='tiles-link'>
                  <div className='intro-y'>
                    <div className='report-box zoom-in'>
                      <div className='box p-3'>
                        <div className='flex justify-content-between '>
                          {' '}
                          <i class='fa fa-user-o fa-2x' aria-hidden='true'></i>
                          <span className='text-align-right text-base tiles-data'>
                            {' '}
                            <div className='td-approved'>
                              <span>Approved</span><span>{memberCountApproved}</span>
                            </div>
                            <div className='td-rejected'>
                              <span>Rejected</span><span>{memberCountRejected}</span>
                            </div>
                            <div className='td-pending'>
                              <span>Pending</span><span>{memberCountPending}</span>
                            </div>
                          </span>
                        </div>
                        <div className=' font-bold leading-8 mt-6'>
                          
                        </div>
                        <div className='text-base text-gray-600'>
                          <Translate content='members' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to={'/events'} className='tiles-link'>
                  <div className='intro-y'>
                    <div className='report-box zoom-in'>
                      <div className='box p-3'>
                        <div className='flex'>
                          <i
                            class='fa fa-calendar-o fa-2x'
                            aria-hidden='true'
                          ></i>{' '}
                        </div>
                        <div className='text-2xl font-bold leading-8 mt-6'>
                          {eventsCount}
                        </div>
                        <div className='text-base text-gray-600'>
                          <Translate content='Activities' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to={'/hospitals-facilities'} className='tiles-link'>
                  <div className='intro-y'>
                    <div className='report-box zoom-in'>
                      <div className='box p-3'>
                        <div className='flex'>
                          {' '}
                          <i
                            class='fa fa-hospital-o fa-2x'
                            aria-hidden='true'
                          ></i>
                        </div>
                        <div className='text-2xl font-bold leading-8 mt-6'>
                          {hospitalCount}
                        </div>
                        <div className='text-base text-gray-600'>
                          <Translate content='hospitals' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={'/doctors'} className='tiles-link'>
                  <div className='intro-y'>
                    <div className='report-box zoom-in'>
                      <div className='box p-3'>
                        <div className='flex'>
                          <i class='fa fa-user-md fa-2x' aria-hidden='true'></i>
                        </div>
                        <div className='text-2xl font-bold leading-8 mt-6'>
                          {doctorCount}
                        </div>
                        <div className='text-base text-gray-600'>
                          <Translate content='doctors' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            ) : (
              <PageLoading />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
