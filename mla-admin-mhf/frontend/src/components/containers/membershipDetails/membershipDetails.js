import React from "react";
import "./membershipDetails.scss";
import {
  Row,
  Col,
  Label,
  Modal,
  ModalBody,
  Button,
  FormGroup,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

import { VscClose } from "react-icons/vsc";
import axios from "axios";
import { connect } from "react-redux";
import adminService from "../../services/adminService";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageLoading from "../../elements/pageLoading/pageLoading";

class MembershipDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      memberDetails: {},
      toggleUpdateStatus: false,
      toggleUpdateDate: false,
      updateStatus: "",
      updateStatusDetail: false,
      fetchingDetails: false,
      issueDate: "",
      expiryDate: "",
      reason: "",
      toggleDeleteUser: false,
      deletingDetails: false,
      confirmtext: "",
      member_id: "",
      expired: false
    };
  }

  componentDidMount() {
    const id = this.props.match.params.member_id;
    this.setState({ member_id: id });
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
            console.log(memberDetails);
            thisView.setState({
              memberDetails,
              issueDate: memberDetails.issueDate
                ? new Date(memberDetails.issueDate)
                : "",
              expiryDate: memberDetails.expiryDate
                ? new Date(memberDetails.expiryDate)
                : "",
            });

            if(memberDetails && (memberDetails.memberShipStatus == "Approved" || memberDetails.memberShipStatus == "Rejected") && memberDetails.expiryDate){
              let expireIn = moment(moment(memberDetails.expiryDate)).diff(new Date(), "days");
              if(expireIn < 0){
                thisView.setState({ expired: true });
              }
            }

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
  updateMemberShipStatus = (status) => {
    this.setState({ updateStatusDetail: true });
    const { memberDetails, reason } = this.state;
    var thisView = this;
    let details = {
      memberShipStatus: status,
      id: memberDetails._id,
      reason,
    };

    if(this.props.operation === "renew"){
      if(details.memberShipStatus === "Rejected"){
        details.memberShipStatus = "Renewal Rejected";
      }
    }

    console.log(details);
    axios
      .all([adminService.updateMemberShipStatus(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          console.log(resData);
          if (resData) {
            // thisView.props.history.push('/membership')
            thisView.getMembersDetails(thisView.props.match.params.member_id);
            thisView.updateStatusModel("close");
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ updateStatusDetail: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });
  };
  updateMemberShipDate = () => {
    this.setState({ updateDateDetail: true });
    const { memberDetails, issueDate, expiryDate } = this.state;
    var thisView = this;
    let details = {
      id: memberDetails._id,
      issueDate,
      expiryDate,
    };
    console.log(details);
    axios
      .all([adminService.updateMemberShipDate(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          console.log(resData);
          if (resData) {
            thisView.getMembersDetails(thisView.props.match.params.member_id);
            thisView.updateDateModel("close");
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ updateDateDetail: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });
  };
  updateStatusModel = (updateStatus) => {
    this.setState({
      toggleUpdateStatus: !this.state.toggleUpdateStatus,
      updateStatus,
      reason: "",
    });
  };
  updateDateModel = () => {
    this.setState({
      toggleUpdateDate: !this.state.toggleUpdateDate,
      // issueDate: '',
      // expiryDate: ''
    });
  };

  updateDeleteModal = () => {
    this.setState({ toggleDeleteUser: !this.state.toggleDeleteUser });
  };

  deleteUserAction = () => {
    this.setState({ deletingDetails: true });
    const { memberDetails } = this.state;
    var thisView = this;
    let details = {
      accountId: memberDetails._id,
      accountNo: memberDetails.mobileNo,
    };

    axios
      .all([adminService.deleteMemberAccount(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          if (resData) {
            thisView.props.history.push("/membership");
            toast("Deleted MemberShip Successfully");
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ updateDateDetail: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });
  };

  render() {
    const {
      memberDetails,
      toggleUpdateStatus,
      updateStatus,
      toggleUpdateDate,
      issueDate,
      expiryDate,
      reason,
      updateStatusDetail,
      updateDateDetail,
      fetchingDetails,
      toggleDeleteUser,
      confirmtext,
      deletingDetails,
      member_id,
    } = this.state;
    let profileImage =
      this.props.config.fileBasicPath + memberDetails.profilePhoto;
    let adharPic = memberDetails.idProof
      ? this.props.config.fileBasicPath + memberDetails.idProof
      : "";
    return (
      <div className="col-span-12 membership-details">
        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="intro-y col-span-12 lg:col-span-10">
            {!fetchingDetails ? (
              <div className="intro-y box">
                <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200">
                  <h2 className="font-medium text-base mr-auto">
                    Member Detail
                  </h2>
                  <div>
                    {memberDetails.memberShipStatus === "Pending" ? (
                      <>
                        <Button
                          className="prev-btn btn "
                          onClick={() => this.updateStatusModel("Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          type="submit"
                          className="next-btn btn"
                          onClick={() => this.updateStatusModel("Rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          className="prev-btn btn "
                          style={{marginLeft: '15px'}}
                          onClick={() =>
                            this.props.history.push(
                              `/membership/update/${member_id}`
                            )
                          }
                        >
                          Update Member
                        </Button>
                      </>
                    ) : (
                      <>
                        {memberDetails.memberShipStatus === "Rejected" && (
                          <Button
                            className="prev-btn btn "
                            onClick={() => this.updateStatusModel("Approved")}
                          >
                            Approve
                          </Button>
                        )}

                        {memberDetails.memberShipStatus === "Approved" && (
                          <>
                            <Button
                              className="prev-btn btn btn-green"
                              onClick={() => this.updateDateModel()}
                            >
                              Update Date
                            </Button>
                          </>
                        )}
                        {memberDetails.memberShipStatus === "Renewal" && (
                          <>
                            <Button
                            className="prev-btn btn "
                            onClick={() => this.updateStatusModel("Approved")}
                          >
                            Approve Renewal
                          </Button>
                          <Button
                            type="submit"
                            className="next-btn btn"
                            onClick={() => this.updateStatusModel("Rejected")}
                          >
                            Reject Renewal
                          </Button>
                          </>
                        )}
                        {memberDetails.memberShipStatus !== "Renewal" && (
                            
                          <>
                            <Button
                              className="prev-btn btn "
                              onClick={() =>
                                this.props.history.push(
                                  `/membership/update/${member_id}`
                                )
                              }
                            >
                              Update Member
                            </Button>
                          </>   

                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {memberDetails.reason && (
                    <Label className="label-name rejected-text">{reason}</Label>
                  )}

                  <Label className="label-name section-heading">
                    Personal Information
                  </Label>
                  {profileImage && (
                    <div className="image-div">
                      <div className="profile-image">
                        <a
                          href={profileImage}
                          target="_blank"
                          title="Adhaar"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={profileImage}
                            alt="profile"
                            className="mx-auto"
                          />
                        </a>
                      </div>
                    </div>
                  )}
                  <table class="data">
                    <tr>
                      <th> Mobile Number</th>
                      <td>
                        {memberDetails.mobileNo ? memberDetails.mobileNo : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th> MemberShip Status</th>
                      <td>
                        <span
                          className={`member-status mr-2 ${
                            memberDetails.memberShipStatus
                              ? memberDetails.memberShipStatus.toLowerCase()
                              : ""
                          }`}
                        >
                          {memberDetails.memberShipStatus}
                        </span>
                      </td>
                    </tr>
                    {memberDetails.memberShipStatus === "Rejected" &&
                      memberDetails.rejectionReason && (
                        <tr>
                          <th> Rejection Reason</th>
                          <td>
                            <span
                              className={`member-status mr-2 ${
                                memberDetails.memberShipStatus
                                  ? memberDetails.memberShipStatus.toLowerCase()
                                  : ""
                              }`}
                            >
                              {memberDetails.rejectionReason}
                            </span>
                          </td>
                        </tr>
                      )}
                    {memberDetails.issueDate && (
                      <tr>
                        <th> Issue Date</th>
                        <td>
                          {memberDetails.issueDate
                            ? moment(memberDetails.issueDate).format(
                                "YYYY-MM-DD"
                              )
                            : "NA"}
                        </td>
                      </tr>
                    )}
                    {memberDetails.expiryDate && (
                      <tr>
                        <th> Expiry Date</th>
                        <td>
                          {memberDetails.expiryDate
                            ? moment(memberDetails.expiryDate).format(
                                "YYYY-MM-DD"
                              )
                            : "NA"}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th> Expired</th>
                      <td>
                        {this.state.expired ? <span style={{color:'red'}}>Yes</span> : "No"}
                      </td>
                    </tr>
                    <tr>
                      <th> MemberShip Id</th>
                      <td>
                        {memberDetails.memberShipId
                          ? "MHF" + memberDetails.memberShipId
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th> Reference</th>
                      <td>
                        {memberDetails.reference
                          ? memberDetails.reference
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th> Full Name</th>
                      <td>
                        {memberDetails.fullName ? memberDetails.fullName : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Father Name</th>
                      <td>
                        {memberDetails.fatherName
                          ? memberDetails.fatherName
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>
                        {memberDetails.email ? memberDetails.email : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Date Of Birth</th>
                      <td>
                        {memberDetails.dateOfBirth
                          ? moment(memberDetails.dateOfBirth).format(
                              "YYYY-MM-DD"
                            )
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Gender</th>
                      <td>
                        {memberDetails.gender ? memberDetails.gender : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Marital Status</th>
                      <td>
                        {memberDetails.maritalStatus
                          ? memberDetails.maritalStatus
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Adhaar</th>
                      <td>
                        <p className="mb-2"> {memberDetails.aadhar}</p>
                        {adharPic && (
                          <>
                            <a
                              href={adharPic}
                              target="_blank"
                              title="Adhaar"
                              rel="noopener noreferrer"
                            >
                              <div className="adhaar-election-img">
                                <img src={adharPic} alt="profile" />
                              </div>
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                   
                  </table>
                  {memberDetails.payments && memberDetails.payments.length > 0 && (
                    <>
                      <Label className="label-name section-heading padding-top">
                        Payments
                      </Label>
                      {memberDetails.payments &&
                        memberDetails.payments.length > 0 &&
                        memberDetails.payments.map((eachPayment, index) => {
                          return (
                            <>
                              <table class="data mb-3">
                                <tr>
                                  <th> Payment Type</th>
                                  <td>
                                    {eachPayment.paymentType
                                      ? eachPayment.paymentType
                                      : "NA"}
                                  </td>
                                </tr>
                                <tr>
                                  <th> Payment Id</th>
                                  <td>
                                    {eachPayment.paymentId
                                      ? eachPayment.paymentId
                                      : "NA"}
                                  </td>
                                </tr>
                                <tr>
                                  <th> Payment Duration</th>
                                  <td>
                                    {eachPayment.paymentDuration
                                      ? eachPayment.paymentDuration
                                      : "NA"}
                                  </td>
                                </tr>
                                <tr>
                                  <th>Payment Receipt</th>
                                  <td>
                                    {eachPayment.paymentReceipt && (
                                      <>
                                        <a
                                          href={
                                            this.props.config.fileBasicPath +
                                            eachPayment.paymentReceipt
                                          }
                                          target="_blank"
                                          title="Payment Receipt"
                                          rel="noopener noreferrer"
                                        >
                                          <div className="adhaar-election-img">
                                            <img
                                              src={
                                                this.props.config
                                                  .fileBasicPath +
                                                eachPayment.paymentReceipt
                                              }
                                              alt="profile"
                                            />
                                          </div>
                                        </a>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </table>
                            </>
                          );
                        })}
                    </>
                  )}
                  <Label className="label-name section-heading padding-top">
                    Contact Information
                  </Label>
                  <table class="data">
                    <tr>
                      <th> Contact Number</th>
                      <td>
                        {memberDetails.contactNumber
                          ? memberDetails.contactNumber
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>
                        {memberDetails.address ? memberDetails.address : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>City</th>
                      <td>{memberDetails.city ? memberDetails.city : "NA"}</td>
                    </tr>
                    <tr>
                      <th>Area</th>
                      <td>{memberDetails.area ? memberDetails.area : "NA"}</td>
                    </tr>
                    <tr>
                      <th>State</th>
                      <td>
                        {memberDetails.state ? memberDetails.state : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Zip Code</th>
                      <td>
                        {memberDetails.zipCode ? memberDetails.zipCode : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Qualification</th>
                      <td>
                        {memberDetails.qualification
                          ? memberDetails.qualification
                          : "NA"}
                      </td>
                    </tr>
                  </table>
                  {memberDetails.familyMembers &&
                    memberDetails.familyMembers.length > 0 && (
                      <>
                        <Label className="label-name section-heading padding-top">
                          Family Members
                        </Label>
                        {memberDetails.familyMembers &&
                          memberDetails.familyMembers.length > 0 &&
                          memberDetails.familyMembers.map(
                            (eachMember, index) => {
                              return (
                                <>
                                  <table class="data mb-3">
                                    <tr>
                                      <th> Name</th>
                                      <td>
                                        {eachMember.name
                                          ? eachMember.name
                                          : "NA"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th> relation</th>
                                      <td>
                                        {eachMember.relation
                                          ? eachMember.relation
                                          : "NA"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th> Adhaar</th>
                                      <td>
                                        {eachMember.idproof
                                          ? eachMember.idproof
                                          : "NA"}
                                      </td>
                                    </tr>
                                  </table>
                                </>
                              );
                            }
                          )}
                      </>
                    )}
                </div>
                <div className="delete-model-container">
                  <Button
                    className="prev-btn btn"
                    onClick={this.updateDeleteModal}
                  >
                    Delete
                  </Button>
                </div>

                <Modal isOpen={toggleUpdateDate} className="add-modal">
                  <ModalBody style={{ backgroundColor: "#fff" }}>
                    <div className="">
                      <div className="col-span-12">
                        <Row className="lg-close">
                          <h1 className="header-text">Update Date</h1>
                          <VscClose
                            className="close-icon"
                            onClick={() => this.updateDateModel("close")}
                          />
                        </Row>
                        <div className=" py-4">
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label> Issue Date</Label>

                                <DatePicker
                                  selected={issueDate}
                                  onChange={(date) =>
                                    this.setState({ issueDate: date })
                                  }
                                  placeholderText="Issue Date"
                                  showYearDropdown
                                  yearDropdownItemNumber={100}
                                  scrollableYearDropdown
                                  timeIntervals={15}
                                  dateFormat="MMMM d, yyyy"
                                  minDate={
                                    new Date(
                                      moment().subtract(12 * 5, "months")
                                    )
                                  }
                                  maxDate={
                                    new Date(moment().add(12 * 5, "months"))
                                  }
                                  className="form-control"
                                  style={{ width: "100% !important" }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Expiry Date</Label>

                                <DatePicker
                                  selected={expiryDate}
                                  onChange={(date) =>
                                    this.setState({ expiryDate: date })
                                  }
                                  placeholderText="Expiry Date"
                                  showYearDropdown
                                  yearDropdownItemNumber={100}
                                  scrollableYearDropdown
                                  timeIntervals={15}
                                  dateFormat="MMMM d, yyyy"
                                  minDate={
                                    new Date(
                                      moment().subtract(12 * 5, "months")
                                    )
                                  }
                                  maxDate={
                                    new Date(moment().add(12 * 5, "months"))
                                  }
                                  className="form-control"
                                  style={{ width: "100% !important" }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <Row className="">
                          <Col className="add-button text-right">
                            {updateDateDetail ? (
                              <Button
                                className="update-button mr-3 "
                                color="primary"
                                disabled
                              >
                                <i className="fa fa-spin fa-refresh submit-loading" />
                              </Button>
                            ) : (
                              <Button
                                className="update-button mr-3"
                                color="primary"
                                disabled={
                                  issueDate && expiryDate ? false : true
                                }
                                onClick={() => {
                                  if (issueDate && expiryDate)
                                    this.updateMemberShipDate();
                                }}
                              >
                                <span className="text-white"> Update </span>
                              </Button>
                            )}
                            <Button
                              className="close-button"
                              color="primary"
                              onClick={() => this.updateDateModel("close")}
                            >
                              <span className="text-white"> Close </span>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>

                <Modal isOpen={toggleUpdateStatus} className="add-modal">
                  <ModalBody style={{ backgroundColor: "#fff" }}>
                    <div className="">
                      <div className="col-span-12">
                        <Row className="lg-close">
                          <h1 className="header-text">Update Status</h1>
                          <VscClose
                            className="close-icon"
                            onClick={() => this.updateStatusModel("close")}
                          />
                        </Row>
                        <p className="mt-3 py-4">
                          Are you sure you want to {updateStatus} this
                          Membership
                        </p>
                        {updateStatus === "Rejected" && (
                          <FormGroup>
                            <Label>Reason For Rejection</Label>
                            <Input
                              className="input-textarea"
                              placeholder=" Reason For Rejection"
                              name="reason"
                              type="textarea"
                              onChange={(e) => {
                                this.setState({
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              value={reason}
                            />
                          </FormGroup>
                        )}
                        <Row className="">
                          <Col className="add-button text-right">
                            {updateStatus === "Rejected" ? (
                              <>
                                {updateStatusDetail ? (
                                  <Button
                                    className="update-button mr-3 "
                                    color="primary"
                                    disabled
                                  >
                                    <i className="fa fa-spin fa-refresh submit-loading" />
                                  </Button>
                                ) : (
                                  <Button
                                    className="update-button mr-3 test"
                                    color="primary"
                                    disabled={reason ? false : true}
                                    onClick={() =>
                                      reason
                                        ? this.updateMemberShipStatus(
                                            updateStatus
                                          )
                                        : ""
                                    }
                                  >
                                    <span className="text-white"> Update </span>
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                {updateStatusDetail ? (
                                  <Button
                                    className="update-button mr-3 "
                                    color="primary"
                                    disabled
                                  >
                                    <i className="fa fa-spin fa-refresh submit-loading" />
                                  </Button>
                                ) : (
                                  <Button
                                    className="update-button mr-3"
                                    color="primary"
                                    onClick={() =>
                                      this.updateMemberShipStatus(updateStatus)
                                    }
                                  >
                                    <span className="text-white"> Update </span>
                                  </Button>
                                )}
                              </>
                            )}
                            <Button
                              className="close-button btn"
                              onClick={() => this.updateStatusModel("close")}
                            >
                              <span className="text-white"> Close </span>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
                <Modal isOpen={toggleDeleteUser} className="add-modal">
                  <ModalBody style={{ backgroundColor: "#fff" }}>
                    <div className="">
                      <div className="col-span-12">
                        <Row className="lg-close">
                          <h1 className="header-text">Delete Member</h1>
                          <VscClose
                            className="close-icon"
                            onClick={this.updateDeleteModal}
                          />
                        </Row>
                        <Row className="">
                          <span className="mt-3 ml-2">
                            Are you sure you want to Delete this Membership
                          </span>
                          <span className="ml-2">
                            Please type <b>{memberDetails.mobileNo}</b> to
                            confirm
                          </span>
                          <Input
                            className="input mb-2 ml-2"
                            placeholder=""
                            name="confirmtext"
                            type="text"
                            onChange={(e) => {
                              this.setState({
                                [e.target.name]: e.target.value,
                              });
                            }}
                            value={confirmtext}
                          />
                        </Row>
                        <Row className="">
                          <Col className="add-button text-right">
                            {deletingDetails ? (
                              <Button
                                className="update-button mr-3 "
                                color="primary"
                                disabled
                              >
                                <i className="fa fa-spin fa-refresh submit-loading" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  className="close-button"
                                  color="primary"
                                  onClick={this.updateDeleteModal}
                                >
                                  <span className="text-white"> Close </span>
                                </Button>
                                <Button
                                  className="btn prev-btn"
                                  onClick={this.deleteUserAction}
                                  style={{ marginLeft: "10px", marginRight: 0 }}
                                  disabled={
                                    memberDetails.mobileNo !== confirmtext
                                  }
                                >
                                  <span className="text-white"> Delete </span>
                                </Button>
                              </>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
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
  config: state.auth.config,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MembershipDetails);
