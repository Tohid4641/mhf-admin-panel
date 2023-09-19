import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Base from "../../layout/Base";
import Basepages from "../../layout/Basepages";

import { ToastContainer, toast } from "react-toastify";
import "./appRoutes.scss";
import Home from "../../containers/home";
import Complaints from "../../containers/complaints";
import ComplaintEvent from "../../containers/complaintEvents";
import Events from "../../containers/events";
import EventDetails from "../../containers/eventDetails";
import Gallery from "../../containers/gallery";
import MlaProfile from "../../containers/mlaProfile";
import Projects from "../../containers/projects";
import Users from "../../containers/users";
import Contact from "../../containers/contacts";
import ContactsForm from "../../containers/contactsForm/contactsForm";
import EventsForm from "../../containers/eventsForm/eventsForm";
import MlaProfileForm from "../../containers/mlaprofileForm/mlaprofileForm";
import Departments from "../../containers/departments";
import DepartmentsForm from "../../containers/departmentsForm";
import UsersForm from "../../containers/usersForm/usersForm";
import Login from "../../containers/login";
import ProjectsDetails from "../../containers/projectsDetails/projectsDetails";
import Albums from "../../containers/albums";
import AlbumForm from "../../containers/albumForm";
import AlbumDetails from "../../containers/albumDetails";
import * as Storage from "../../services/localstorage";
import { authenticate } from "../../../store/actions/auth";
import ContactDetails from "../../containers/contactDetails/contactDetails";
import ContactUs from "../../containers/contactUs/contactUs";
import ContactUsForm from "../../containers/contactUsForm/contactUsForm";
import ServiceHeads from "../../containers/serviceHeads/serviceHeads";
import ServiceHeadDetails from "../../containers/serviceHeadDetails/serviceHeadDetails";
import Settings from "../../containers/settings/settings";
import AboutUs from "../../containers/aboutUs/aboutUs";
import HospitalsFacilities from "../../containers/hospitalsFacilities/hospitalsFacilities";
import HospitalDetails from "../../containers/hospitalDetails/hospitalDetails";
import AddHospital from "../../containers/addHospital/addHospital";
import Doctors from "../../containers/doctors/doctors";
import DoctorDetails from "../../containers/doctorDetails/doctorDetails";
import DoctorForm from "../../containers/doctorForm/doctorForm";
import JoinUs from "../../containers/joinUs/joinUs";
import Membership from "../../containers/membership/membership";
import MembershipForm from "../../containers/membershipForm/membershipForm";
import MembershipDetails from "../../containers/membershipDetails/membershipDetails";
import MembershipCard from "../../containers/membershipCard/membershipCard";
import Renew from "../../containers/renew/renew";
import Renewal from "../../containers/renewal/Renewal";
import RenewalRequest from "../../containers/renewalRequest";

const listofPages = ["/login"];

class MainRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    };
  }

  componentDidMount() {
    console.log("tools main");
    this.checkUserSession();
  }

  checkUserSession = () => {
    let key = Storage.authKey;
    let session = Storage.get(key);
    let authData = session ? JSON.parse(session) : {};
    let response = Storage.checkUserSession(authData);
    if (response.status) {
      this.props.updatingAuthenticate(response.data);
    } else {
      this.props.history.push({ pathname: "/login" });
    }
    this.setState({ checkingSession: false });
    // this.setState({checkingSession: true});
  };

  componentWillUnmount() {}

  render() {
    const { location } = this.props;
    console.log(location)
    console.log(this.props)
    const { checkingSession } = this.state;

    return (
      !checkingSession && (
        <Fragment>
          {listofPages.indexOf(location.pathname) > -1 ? (
            <Basepages>
              <Switch>
                <Route
                  exact
                  path="/login"
                  render={(props) => {
                    return <Login {...props} />;
                  }}
                />
                <Redirect to="/login" />
              </Switch>
            </Basepages>
          ) : (
            <Base location={location}>
              <ToastContainer />
              <Switch>
                <Route
                  exact
                  path="/home"
                  render={(props) => {
                    return <Home {...props} />;
                  }}
                />
                <Route
                  path="/complaints/:complaint_id"
                  render={(props) => {
                    return <ComplaintEvent {...props} />;
                  }}
                />
                <Route
                  path="/complaints"
                  render={(props) => {
                    return <Complaints {...props} />;
                  }}
                />
                <Route
                  path="/events/add"
                  render={(props) => {
                    return <EventsForm {...props} />;
                  }}
                />
                <Route
                  path="/events/update/:event_id"
                  render={(props) => {
                    return <EventsForm {...props} />;
                  }}
                />
                <Route
                  path="/events/:event_id"
                  render={(props) => {
                    return <EventDetails {...props} />;
                  }}
                />
                <Route
                  path="/events"
                  render={(props) => {
                    return <Events {...props} />;
                  }}
                />
                <Route
                  path="/gallery"
                  render={(props) => {
                    return <Gallery {...props} />;
                  }}
                />
                <Route
                  path="/profile/update"
                  render={(props) => {
                    return <MlaProfileForm {...props} />;
                  }}
                />
                <Route
                  path="/profile"
                  render={(props) => {
                    return <MlaProfile {...props} />;
                  }}
                />
                <Route
                  path="/projects/add"
                  render={(props) => {
                    return <EventsForm {...props} />;
                  }}
                />
                <Route
                  path="/projects/update/:project_id"
                  render={(props) => {
                    return <EventsForm {...props} />;
                  }}
                />
                <Route
                  path="/projects/:project_id"
                  render={(props) => {
                    return <ProjectsDetails {...props} />;
                  }}
                />
                <Route
                  path="/projects"
                  render={(props) => {
                    return <Projects {...props} />;
                  }}
                />
                <Route
                  path="/users/add"
                  render={(props) => {
                    return <UsersForm {...props} />;
                  }}
                />
                <Route
                  path="/users"
                  render={(props) => {
                    return <Users {...props} />;
                  }}
                />
                <Route
                  path="/contacts/add"
                  render={(props) => {
                    return <ContactsForm {...props} />;
                  }}
                />
                <Route
                  path="/contacts/update/:contact_id"
                  render={(props) => {
                    return <ContactsForm {...props} />;
                  }}
                />
                <Route
                  path="/contacts/:contact_id"
                  render={(props) => {
                    return <ContactDetails {...props} />;
                  }}
                />
                <Route
                  path="/contacts"
                  render={(props) => {
                    return <Contact {...props} />;
                  }}
                />
                <Route
                  path="/contactUs/update"
                  render={(props) => {
                    return <ContactUsForm {...props} />;
                  }}
                />
                <Route
                  path="/contactUs"
                  render={(props) => {
                    return <ContactUs {...props} />;
                  }}
                />
                <Route
                  path="/departments/add"
                  render={(props) => {
                    return <DepartmentsForm {...props} />;
                  }}
                />
                <Route
                  path="/departments/update/:department_id"
                  render={(props) => {
                    return <DepartmentsForm {...props} />;
                  }}
                />
                <Route
                  path="/departments"
                  render={(props) => {
                    return <Departments {...props} />;
                  }}
                />
                <Route
                  path="/albums/add"
                  render={(props) => {
                    return <AlbumForm {...props} />;
                  }}
                />
                <Route
                  path="/albums/update/:album_id"
                  render={(props) => {
                    return <AlbumForm {...props} />;
                  }}
                />
                <Route
                  path="/albums/:album_id"
                  render={(props) => {
                    return <AlbumDetails {...props} />;
                  }}
                />
                <Route
                  path="/albums"
                  render={(props) => {
                    return <Albums {...props} />;
                  }}
                />
                <Route
                  path="/serviceheads/add"
                  render={(props) => {
                    return <ContactsForm {...props} />;
                  }}
                />
                <Route
                  path="/serviceheads/update/:serviceheads_id"
                  render={(props) => {
                    return <ContactsForm {...props} />;
                  }}
                />
                <Route
                  path="/serviceheads/:serviceheads_id"
                  render={(props) => {
                    return <ServiceHeadDetails {...props} />;
                  }}
                />
                <Route
                  path="/serviceheads"
                  render={(props) => {
                    return <ServiceHeads {...props} />;
                  }}
                />
                <Route
                  path="/settings"
                  render={(props) => {
                    return <Settings {...props} />;
                  }}
                />
                <Route
                  path="/about-us"
                  render={(props) => {
                    return <AboutUs {...props} />;
                  }}
                />
                <Route
                  path="/hospitals-facilities/add"
                  render={(props) => {
                    return <AddHospital {...props} />;
                  }}
                />
                <Route
                  path="/hospitals-facilities/update/:hospitalId"
                  render={(props) => {
                    return <AddHospital {...props} />;
                  }}
                />
                <Route
                  path="/hospitals-facilities/:hospitalId"
                  render={(props) => {
                    return <HospitalDetails {...props} />;
                  }}
                />
                <Route
                  path="/hospitals-facilities"
                  render={(props) => {
                    return <HospitalsFacilities {...props} />;
                  }}
                />
                <Route
                  path="/doctors/add"
                  render={(props) => {
                    return <DoctorForm {...props} />;
                  }}
                />
                <Route
                  path="/doctors/update/:doctorId"
                  render={(props) => {
                    return <DoctorForm {...props} />;
                  }}
                />
                <Route
                  path="/doctors/:doctorId"
                  render={(props) => {
                    return <DoctorDetails {...props} />;
                  }}
                />
                <Route
                  path="/doctors"
                  render={(props) => {
                    return <Doctors {...props} />;
                  }}
                />
                <Route
                  path="/join-us"
                  render={(props) => {
                    return <JoinUs {...props} />;
                  }}
                />
                <Route
                  path="/membership/add"
                  render={(props) => {
                    return <MembershipForm operation="add" {...props} />;
                  }}
                />
                <Route
                  path="/membership/update/:member_id"
                  render={(props) => {
                    return <MembershipForm  operation="update" {...props} />;
                  }}
                />
                <Route
                  path="/membership/review/:member_id"
                  render={(props) => {
                    return <MembershipForm  operation="review" {...props} />;
                  }}
                />
                <Route
                  path="/membership/renew/:member_id"
                  render={(props) => {
                    return <Renew {...props} />;
                  }}
                />
                <Route
                  path="/membership/card/:member_id"
                  render={(props) => {
                    return <MembershipCard {...props} />;
                  }}
                />
                <Route
                  path="/membership/:member_id"
                  render={(props) => {
                    return <MembershipDetails {...props} />;
                  }}
                />
                <Route
                  path="/membership"
                  render={(props) => {
                    return <Membership {...props} />;
                  }}
                />
                <Route
                  path="/by-expiry/:member_id"
                  render={(props) => {
                    return <MembershipDetails {...props} />;
                  }}
                />
                <Route
                  path="/by-expiry"
                  render={(props) => {
                    return <Renewal {...props} />;
                  }}
                />
                <Route
                  path="/renewal-request/:member_id"
                  render={(props) => {
                    return <MembershipDetails operation="renew" {...props} />;
                  }}
                />
                <Route
                  path="/renewal-request"
                  render={(props) => {
                    return <RenewalRequest {...props} />;
                  }}
                />

                <Redirect to="/home" />
              </Switch>
            </Base>
          )}
        </Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.auth.config,
});

const mapDispatchToProps = (dispatch) => ({
  updatingAuthenticate(data) {
    dispatch(authenticate(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainRoutes);
