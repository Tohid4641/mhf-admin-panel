import React from "react";
import "./membershipCard.scss";
import { Row, Col, Card, CardBody } from "reactstrap";
import Logo from "../../images/main/logoc4.png";
import profileImg from "../../images/user-icon.png";
import axios from "axios";
import { connect } from "react-redux";
import adminService from "../../services/adminService";
import moment from "moment";
import { Link } from "react-router-dom";
import PageLoading from "../../elements/pageLoading/pageLoading";
import { jsPDF } from "jspdf";
import createPDF from "./createPDF";
class MembershipCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false,
      memberDetails: {},
      fetchingDetails: false,
    };
  }

  componentDidMount() {
    const id = this.props.match.params.member_id;
    if (id) {
      this.getMembersDetails(id);
    }
  }
  getMembersDetails = (member_id) => {
    var thisView = this;
    thisView.setState({ fetchingDetails: true });
    let details = {
      id: member_id,
    };
    axios
      .all([adminService.getMembersDetails(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let memberDetails = resData.data.user ? resData.data.user : {};
            memberDetails.familyMembers =
              resData.data && resData.data.familyMembers
                ? resData.data.familyMembers
                : [];
            memberDetails.payments =
              resData.data && resData.data.payments
                ? resData.data.payments
                : [];
            // console.log(memberDetails);
            thisView.setState({ memberDetails });
            thisView.setState({ Success_msg: "" });
          } else {
            thisView.setState({ apiError: resData });
          }
          thisView.setState({ fetchingDetails: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in Get Member Detail");
      });
  };
  statusModal = (row) => {
    this.setState({
      status: !this.state.status,
    });
  };

  render() {
    const { status, memberDetails, fetchingDetails } = this.state;
    let profileImage = memberDetails.profilePhoto
      ? this.props.config.fileBasicPath + memberDetails.profilePhoto
      : Logo;

    // GENERATE CARD PDF USING JSPDF MODULE
    const generatePDF = () => {
      const doc = new jsPDF();
      createPDF(doc, memberDetails, profileImage);
    };
    // console.log(memberDetails);

    return (
      <div className="col-span-12 membership-card">
        <div className="col-span-12 xxl:col-span-9">
          <div className="intro-y flex items-end mt-10 mb-10">
            <h2 className="text-lg text-black font-medium">Member Details</h2>
          </div>
        </div>
        {!fetchingDetails ? (
          <Row>
            <Col sm md lg={12} className="mb-30 page-section">
              <Card className="card-statistics h-100">
                <CardBody>
                  <div className=" px-5 ">
                    <div className="logo-img-section">
                      <img
                        src={Logo}
                        alt="Logo"
                        className="logo-image mx-auto"
                      />
                    </div>
                    <div class=" p-2  mt-8">
                      <div className="justify-content-between flex align-items-center">
                        <div>
                          <h4
                            className={`${memberDetails.memberShipStatus}-status-label`}
                          >
                            {memberDetails.memberShipStatus}
                          </h4>
                        </div>
                        <div className="status-switch">
                          <h4 className="btn-label mb-4">
                            <button
                              type="button"
                              onClick={generatePDF}
                              style={{
                                backgroundColor: "#253c80",
                                outline: "none",
                              }}
                              class="btn btn-success"
                            >
                              Download
                            </button>
                          </h4>
                          <h4 className="switch-label ">
                            Switch Front/Back Card
                          </h4>
                          <div className="toggle-section">
                            <div className="toggle">
                              <input
                                type="checkbox"
                                checked={status}
                                onChange={() => this.statusModal()}
                              />
                              <label
                                className={`${status ? "onbtn" : "ofbtn"}`}
                              ></label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-section">
                        <div className="card-header-section">
                          <h2 className="heading-text">
                            Mujtaba Helping Foundation
                          </h2>
                          <h2 className="small-heading-text">
                            The Hands That Help Are Holler Than The Lips That
                            Pray
                          </h2>
                        </div>
                        <div className="card-inner-section">
                          <h4 className="data-text text-right">
                            Card ID: #MHF002
                          </h4>
                          {!status ? (
                            <>
                              <Row>
                                <Col md={2}>
                                  <div className="image-div">
                                    <div className="profile-image mx-auto">
                                      {profileImage ? (
                                        <img
                                          src={profileImage}
                                          alt="profile"
                                          className="mx-auto"
                                        />
                                      ) : (
                                        <img
                                          src={profileImg}
                                          alt="profile"
                                          className="mx-auto"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={8}>
                                  <div className="profile__header">
                                    <h4 className="text-muted label-text">
                                      Full Name
                                    </h4>
                                    <h4 className="data-text">
                                      {memberDetails.name}
                                    </h4>
                                    <h4 className="text-muted label-text">
                                      Father Name
                                    </h4>
                                    <h4 className="data-text">
                                      {memberDetails.fatherName}
                                    </h4>
                                  </div>
                                </Col>
                              </Row>
                              <h4 className="text-muted label-text">Address</h4>
                              <h4 className="data-text">
                                {memberDetails.address}
                              </h4>
                              <div className="flex justify-content-between mt-2">
                                <h4 className="data-text">
                                  Card Issue : &nbsp;
                                  {moment(memberDetails.createdAt).format(
                                    "YYYY-MM-DD"
                                  )}
                                </h4>
                                <h4 className="data-text">
                                  Expiry : &nbsp;2022-04-16
                                </h4>
                              </div>
                            </>
                          ) : (
                            <>
                              <h2 className="heading-member-text">
                                Family Members
                              </h2>
                              <div className="members-text  mt-2">
                                {memberDetails.familyMembers &&
                                  memberDetails.familyMembers.map(
                                    (eachMember, index) => {
                                      return (
                                        <div key={index}>
                                          <Row className="text-center border-bottom-member">
                                            <Col md={4}>
                                              <h4 className="data-text">
                                                {eachMember.fullName}{" "}
                                              </h4>
                                            </Col>
                                            <Col md={4}>
                                              <h4 className="data-text">
                                                {eachMember.relation}{" "}
                                              </h4>
                                            </Col>
                                            <Col md={4}>
                                              <h4 className="data-text">
                                                {eachMember.idNumber}{" "}
                                              </h4>
                                            </Col>
                                          </Row>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                              <h4 className="text-muted label-text">
                                MHF Office Address:
                              </h4>

                              <h4 className="data-address-text">
                                <Link to="/">6-3 1240/2019/4,</Link> 2nd floor,
                                Near Masjid Al-Habeeb,
                                <br />
                                Ms Maqta, Opp, Raj Bhavan, Somajiguda Hyderabad
                                <br />
                                <Link to="/">+91 8331960001,</Link>{" "}
                                <Link to="/">+91 8309488732,</Link>
                                <Link to="/">+91 8328266670.</Link>
                              </h4>
                            </>
                          )}
                        </div>
                        <div className="card-footer-section">
                          <div className="flex justify-content-between mt-2">
                            <h4 className="data-text">www.mhfglobal.com</h4>
                            <h4 className="data-text">
                              mhf8886210001@gmail.com
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <PageLoading />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  config: state.auth.config,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MembershipCard);
