import React, { Fragment } from "react";
import "./membershipForm.scss";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import axios from "axios";
import adminService from "../../services/adminService";
import validators from "../../validators/validators";
import { connect } from "react-redux";
// import Translate from 'react-translate-component'
import profileImg from "../../images/user-icon.png";
import {
  Row,
  Col,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  Alert,
  Button,
} from "reactstrap";
import { VscClose } from "react-icons/vsc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ScaleLoader from "react-spinners/ScaleLoader";

class MembershipForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalInfo: {},
      contactInformation: {},
      familyMembers: [],
      paymentMethod: {},
      newfiles: "",
      adhaarPhoto: "",
      date: new Date(),
      maritalStatus: "",
      relation: "",
      gender: "",
      profileFile: "",
      inputs: [{ fullName: "" }],
      profile: "",
      role: "",
      address: "",
      mobile_no: "",
      qualification: "",
      email: "",
      file: "",
      authenticating: false,
      updateMember: false,
      serviceHead: false,
      contactDetails: {},
      stepCount: 1,
      others: false,
      addingMemberDetails: false,
      planType: [
        {
          label: "Six Month Plan",
          value: "Six Month Plan",
          planTypeName: "Six Month Plan",
          planTypeId: "1",
        },
        {
          label: "One Year Plan",
          value: "One Year Plan",
          planTypeName: "One Year Plan",
          planTypeId: "2",
        },
      ],
      selectedPlan: {},
      planTypeId: "",
      activePlan: "",
      paymentOption: false,
      formDetails: true,
      selectedPayment: "Online Payment",
      paymentFiles: [],
      paymentScreenShoot: "",
      toggleModal: false,
      member: {},
      member_id: "",
      memberId: "",
      profileImage: "",
      adhaarImage: "",
      profileImgError: false,
      adhaarImgError: false,
      genderError: false,
      maritalError: false,
      relationError: false,
      eduQualError: false,
    };
    this.validators = validators;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.updateValidators([e.target.name], e.target.value);
  };
  onChangeDate = (date) => {
    this.setState({
      date: date,
    });
    this.updateValidators("date", date);
  };

  updateValidators = (fieldName, value) => {
    this.validators[fieldName].errors = [];
    this.validators[fieldName].state = value;
    this.validators[fieldName].valid = true;
    this.validators[fieldName].rules.forEach((rule) => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      } else if (typeof rule.test === "function") {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  };

  isFormValidContactInfo = () => {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (
        field === "mobile_no" ||
        field === "address" ||
        field === "area" ||
        field === "city" ||
        field === "state" ||
        field === "zipCode" ||
        field === "reference"
      ) {
        if (!this.validators[field].valid) {
          status = false;
        }
      }
    });
    return status;
  };
  isFormValidPersonalInfo = () => {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (
        field === "fullName" ||
        field === "fatherSpouseName" ||
        field === "email" ||
        field === "adhaar" ||
        field === "date"
      ) {
        if (!this.validators[field].valid) {
          status = false;
        }
      }
    });
    return status;
  };

  displayValidationErrors = (fieldName) => {
    const validator = this.validators[fieldName];
    const result = "";
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className="error" key={index}>
            * {info}
            <br />
          </span>
        );
      });
      return <div className="col s12 row">{errors}</div>;
    }
    return result;
  };
  onChangeFileHandler = (e) => {
    let finalValue = e.target.files[0];
    finalValue["field"] = e.target.name;
    this.setState({
      [e.target.name]: finalValue,
    });
    // this.setState({
    //   [e.target.name]: e.target.files
    // })
    let thisView = this;
    let file1 = Array.from(e.target.files);
    thisView.setState({
      newfiles: file1,
      adhaarImgError: false,
      genderError: false,
      maritalError: false,
      relationError: false,
    });
  };
  onChangeProfile = (e) => {
    let finalValue = e.target.files[0];
    finalValue["field"] = e.target.name;
    this.setState({
      [e.target.name]: finalValue,
    });
    // this.setState({
    //   [e.target.name]: e.target.files
    // })
    let thisView = this;
    let file1 = Array.from(e.target.files);
    thisView.setState({ profileFile: file1, profileImgError: false });
  };
  numberofelectionFiles = () => {
    const { electionFiles } = this.state;
    if (electionFiles.length === 0) {
      return null;
    }
    return (
      <p
        style={{
          marginBottom: "0rem",
          paddingLeft: "4px",
          display: "inline-block",
        }}
      >
        file({electionFiles.length})
      </p>
    );
  };
  numberoffile = () => {
    const { newfiles } = this.state;
    if (newfiles.length === 0) {
      return null;
    }
    return (
      <p
        style={{
          marginBottom: "0rem",
          paddingLeft: "4px",
          display: "inline-block",
        }}
      >
        file({newfiles.length})
      </p>
    );
  };
  componentDidMount() {
    if (this.props.location.pathname.indexOf("review") > -1) {
      this.setState({ updateMember: true });
    }
    let member_id = this.props.match.params.member_id;
    if (member_id) {
      this.setState({ memberId: member_id });
      this.getMembersDetails(member_id);
    }
  }
  getMembersDetails = (member_id) => {
    var thisView = this;
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
            // let familyMembers = memberDetails.familyMembers
            //   ? memberDetails.familyMembers
            //   : []
            let fullName = memberDetails.name;
            let fatherSpouseName = memberDetails.fatherName;
            let email = memberDetails.email;
            let date = new Date(memberDetails.dateOfBirth);
            let adhaarImage = memberDetails.idProof;
            let adhaar = memberDetails.aadhar;
            let gender = memberDetails.gender;
            let maritalStatus = memberDetails.maritalStatus;
            let profileImage = memberDetails.profilePhoto;
            let relation = memberDetails.relationType;
            let mobile_no = memberDetails.mobileNo;
            let address = memberDetails.address;
            let area = memberDetails.area;
            let city = memberDetails.city;
            let state = memberDetails.state;
            let zipCode = memberDetails.zipCode;
            let reference = memberDetails.reference;
            let qualification = memberDetails.qualification;

            let familyList = [];
            memberDetails.familyMembers.map((eachFamilyMember, index) => {
              familyList.push({ fullName: eachFamilyMember.name, relationType: eachFamilyMember.relation, idNumber: eachFamilyMember.idproof });
            });

            if(familyList.length === 0){
              familyList.push({ value: "" });
            }

            thisView.setState({
              Success_msg: "",
              fullName,
              fatherSpouseName,
              email,
              date,
              adhaarImage,
              gender,
              profileImage,
              maritalStatus,
              relation,
              mobile_no,
              address,
              area,
              city,
              state,
              zipCode,
              qualification,
              reference,
              adhaar,
              inputs: familyList
            });
            console.log(familyList);
          } else {
            thisView.setState({ apiError: resData });
          }
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in Get Member Detail");
      });
  };
  fileUpload = (uploadFiles, uploadLabels, profileData) => {
    this.setState({ addingMemberDetails: true });
    console.log(uploadFiles);
    var thisView = this;
    axios
      .all([adminService.fileUploadsingle(uploadFiles)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data;
          let fileData = resData;

          fileData.map((eachFile, index) => {
            if(uploadLabels[index] === "profile"){
              profileData.profilePhoto = eachFile.filename;
            } else if(uploadLabels[index] === "adhaarPhoto"){
              profileData.idProof = eachFile.filename;
            } else if(uploadLabels[index] === "paymentScreenShoot"){
              
            }
          })

          if (thisView.state.memberId) 
            thisView.updateMember(profileData);
          else 
            thisView.insertMember(profileData);
          
        }
        //thisView.setState({ fileUploadData: true });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in Uploading File");
      });
  };

  insertMember = (details) => {
    
    var thisView = this;
    this.setState({ addingMemberDetails: true });
  
    axios
      .all([adminService.addMember(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          console.log(resData);
          if (resData) {
            let data = (resData.data && resData.data.data) ? resData.data.data : {};
            if(data._id)
              thisView.props.history.push("/membership/"+data._id);
            else
              thisView.props.history.push("/membership");
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ addingMemberDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });
    
  };

  updateMember = (details) => {
    
    var thisView = this;
    this.setState({ addingMemberDetails: true });
  
    axios
      .all([adminService.updateMember(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          console.log(resData);
          if (resData) {
            thisView.props.history.push("/membership/"+thisView.state.memberId);
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ addingMemberDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });


  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      relationError: false,
      genderError: false,
      maritalError: false,
      eduQualError: false,
    });
  };

  onNext = () => {
    const { stepCount } = this.state;
    if (stepCount < 3) {
      this.setState({ stepCount: stepCount + 1 });
    }
  };

  onPrev = () => {
    const { stepCount } = this.state;
    if (stepCount > 1) {
      this.setState({ stepCount: stepCount - 1 });
    }
  };
  // handleSubmit = (event) =>{
  //   event.preventDefault()
  //   this.setState({ authenticating: true })
  //   this.fileUpload()
  // }
  personalInfoSubmit = (event) => {
    event.preventDefault();

    const {
      profileFile,
      fullName,
      fatherSpouseName,
      email,
      date,
      adhaar,
      newfiles,
      gender,
      maritalStatus,
      relation,
      profileImage,
      adhaarImage,
    } = this.state;

    if (!profileFile && !profileImage) {
      this.setState({ profileImgError: true });
      return;
    }
    if (!relation) {
      this.setState({ relationError: true });
      return;
    }
    if (!newfiles && !adhaarImage) {
      this.setState({ adhaarImgError: true });
      return;
    }
    if (!gender) {
      this.setState({ genderError: true });
      return;
    }
    if (!maritalStatus) {
      this.setState({ maritalError: true });
      return;
    }

    let personalInfo = {
      profileFile: profileFile,
      fullName: fullName,
      fatherSpouseName: fatherSpouseName,
      email: email,
      date: date,
      adhaar: adhaar,
      adhaarFiles: newfiles,
      gender: gender,
      maritalStatus: maritalStatus,
      relation: relation,
    };
    console.log(personalInfo);
    this.setState({ personalInfo });

    this.onNext();
  };

  personalInfo = () => {
    const {
      authenticating,
      profileFile,
      fullName,
      fatherSpouseName,
      email,
      date,
      adhaar,
      newfiles,
      gender,
      maritalStatus,
      relation,
      memberId,
      profileImage,
      adhaarImage,
      adhaarImgError,
      profileImgError,
      genderError,
      maritalError,
      relationError,
    } = this.state;
    let profilePic = profileImage
      ? this.props.config.fileBasicPath + profileImage
      : "";
    let adharPic = adhaarImage
      ? this.props.config.fileBasicPath + adhaarImage
      : "";

    return (
      <>
        <div className="contact-info">
          <Label className="label-name section-heading">
            Personal Information
          </Label>
          <Form onSubmit={this.personalInfoSubmit}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  {profilePic ? (
                    <>
                      <label
                        for="file-upload-profile"
                        style={{ marginLeft: "5px" }}
                        className="custom-file-profile mt-2"
                      >
                        <div className="image-div">
                          <div className="profile-image">
                            {profileFile && profileFile.length > 0 ? (
                              <img
                                src={profileImg}
                                alt="profile"
                                className="mx-auto"
                              />
                            ) : (
                              <img
                                src={profilePic}
                                alt="profile"
                                className="mx-auto"
                              />
                            )}
                          </div>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="file-upload-profile"
                        name="profile"
                        accept="image/*"
                        onChange={this.onChangeProfile}
                      />
                      {profileFile && profileFile.length > 0 ? (
                        <>
                          {profileFile &&
                            profileFile.map((files, index) => (
                              <p style={{ marginBottom: "0rem" }}>
                                {files.name}
                              </p>
                            ))}
                        </>
                      ) : (
                        <>
                          <p style={{ marginBottom: "0rem" }}>{profileImage}</p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <label
                        for="file-upload-profile"
                        style={{ marginLeft: "5px" }}
                        className="custom-file-profile mt-2"
                      >
                        <div className="image-div">
                          <div className="profile-image">
                            <img
                              src={profileImg}
                              alt="profile"
                              className="mx-auto"
                            />
                          </div>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="file-upload-profile"
                        name="profile"
                        accept="image/*"
                        onChange={this.onChangeProfile}
                      />
                      {profileFile && profileFile.length > 0 ? (
                        <>
                          {profileFile &&
                            profileFile.map((files, index) => (
                              <p style={{ marginBottom: "0rem" }}>
                                {files.name}
                              </p>
                            ))}
                        </>
                      ) : (
                        <>
                          <Label className="display-block">
                            {" "}
                            Upload photo (500 x 500)
                          </Label>
                        </>
                      )}
                    </>
                  )}
                  {profileImgError && (
                    <span className="error">Please Upload Profile Image</span>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label> Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    className="input w-full border mt-2 form-control"
                    placeholder="Full Name"
                    onChange={this.onChange}
                    value={fullName}
                  />
                  {this.displayValidationErrors("fullName")}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label> Father / Spouse Name</Label>
                  <Input
                    type="text"
                    name="fatherSpouseName"
                    className="input w-full border mt-2 form-control"
                    placeholder="Father / Spouse Name"
                    onChange={this.onChange}
                    value={fatherSpouseName}
                  />
                  {this.displayValidationErrors("fatherSpouseName")}
                </FormGroup>
              </Col>
              <Col md={12}>
                <div className="filter-sortby relation-radio mt-3 mb-3">
                  <Label>Relation</Label>
                  <div className="sortby-section">
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="relation"
                          value="Father"
                          checked={relation === "Father"}
                          onChange={this.handleChange}
                        />
                        Father
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="relation"
                          value="Mother"
                          checked={relation === "Mother"}
                          onChange={this.handleChange}
                        />
                        Mother
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="relation"
                          value="Husband"
                          checked={relation === "Husband"}
                          onChange={this.handleChange}
                        />
                        Husband
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="relation"
                          value="Wife"
                          checked={relation === "Wife"}
                          onChange={this.handleChange}
                        />
                        Wife
                      </Label>
                    </FormGroup>
                  </div>
                  {relationError && (
                    <div className="error">Please Select Relation</div>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label> Email</Label>
                  <Input
                    type="text"
                    name="email"
                    className="input w-full border mt-2 form-control"
                    placeholder="Email"
                    onChange={this.onChange}
                    value={email}
                  />
                  {this.displayValidationErrors("email")}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label> Date Of Birth</Label>

                  <DatePicker
                    selected={date}
                    onChange={this.onChangeDate}
                    placeholderText="Date Of Birth"
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                    className="form-control date-picker-margin"
                    style={{ width: "100% !important" }}
                  />
                  {this.displayValidationErrors("date")}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label> Adhaar</Label>
                  <Input
                    type="text"
                    name="adhaar"
                    className="input w-full border mt-2 form-control"
                    placeholder="Adhaar"
                    onChange={this.onChange}
                    value={adhaar}
                  />
                  {this.displayValidationErrors("adhaar")}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="display-block"> Upload Adhaar</Label>
                  <label
                    for="file-upload"
                    style={{ marginLeft: "5px" }}
                    className="custom-file-upload mt-2"
                  >
                    <i className="text-info fa fa-cloud-upload"></i> Upload
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    name="adhaarPhoto"
                    accept="image/*"
                    onChange={this.onChangeFileHandler}
                  />
                  {this.numberoffile()}
                  {newfiles &&
                    newfiles.map((files, index) => (
                      <p style={{ marginBottom: "0rem" }}>{files.name}</p>
                    ))}
                  {adhaarImgError && (
                    <div className="error">Please Upload Adhaar</div>
                  )}
                </FormGroup>
                {adharPic && (
                  <>
                    <div className="adhaar-election-img">
                      <img src={adharPic} alt="profile" />
                    </div>
                  </>
                )}
              </Col>

              <Col md={6}>
                <div className="filter-sortby">
                  <Label>Gender</Label>
                  <div className="sortby-section gender-radio">
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === "male"}
                          onChange={this.handleChange}
                        />
                        Male
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === "female"}
                          onChange={this.handleChange}
                        />
                        Female
                      </Label>
                    </FormGroup>
                  </div>
                  {genderError && (
                    <div className="error">Please Select Relation</div>
                  )}
                </div>
              </Col>

              <Col md={12}>
                <div className="filter-sortby marital-radio mt-3">
                  <Label>Marital Status</Label>
                  <div className="sortby-section">
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="maritalStatus"
                          value="Single"
                          checked={maritalStatus === "Single"}
                          onChange={this.handleChange}
                        />
                        Single
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="maritalStatus"
                          value="Married"
                          checked={maritalStatus === "Married"}
                          onChange={this.handleChange}
                        />
                        Married
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="maritalStatus"
                          value="Widow"
                          checked={maritalStatus === "Widow"}
                          onChange={this.handleChange}
                        />
                        Widow
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label check>
                        <Input
                          type="radio"
                          name="maritalStatus"
                          value="Divorce"
                          checked={maritalStatus === "Divorce"}
                          onChange={this.handleChange}
                        />
                        Divorce
                      </Label>
                    </FormGroup>
                  </div>
                  {maritalError && (
                    <div className="error">Please Select Marital Status</div>
                  )}
                </div>
              </Col>
            </Row>
            <div className="btn-div">
              {!authenticating ? (
                <Button
                  type="submit"
                  className="next-btn btn"
                  disabled={
                    memberId
                      ? false
                      : this.isFormValidPersonalInfo()
                      ? false
                      : true
                  }
                  // onClick={}
                >
                  Next
                </Button>
              ) : (
                <i className="fa fa-spin fa-refresh authentication-loading" />
              )}
            </div>
          </Form>
        </div>
      </>
    );
  };
  contactInformation = (event) => {
    event.preventDefault();
    const {
      mobile_no,
      address,
      area,
      city,
      state,
      zipCode,
      qualification,
      reference,
    } = this.state;

    if (!qualification) {
      this.setState({ eduQualError: true });
      return;
    }
    let contactInformation = {
      mobile_no: mobile_no,
      address: address,
      area: area,
      city: city,
      state: state,
      zipCode: zipCode,
      qualification: qualification,
      reference: reference,
    };
    console.log(contactInformation);
    this.setState({ contactInformation });
    this.onNext();
  };
  contactInfo = () => {
    const {
      mobile_no,
      address,
      area,
      city,
      state,
      zipCode,
      qualification,
      reference,
      memberId,
      eduQualError,
    } = this.state;
    return (
      <>
        <div className="personal-info">
          <Label className="label-name section-heading">
            Contact Information
          </Label>
        </div>
        {/* <Form onSubmit={this.contactInformation}> */}
        <Form onSubmit={this.contactInformation}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label> Contact Number</Label>
                <Input
                  type="text"
                  name="mobile_no"
                  className="input w-full border mt-2 form-control"
                  placeholder="Contact Number"
                  onChange={this.onChange}
                  value={mobile_no}
                  disabled={this.props.operation === 'update' ? true : false}
                />
                {this.displayValidationErrors("mobile_no")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Flat Number & Address</Label>
                <Input
                  type="text"
                  name="address"
                  className="input w-full border mt-2 form-control"
                  placeholder="Flat Number & Address"
                  onChange={this.onChange}
                  value={address}
                />
                {this.displayValidationErrors("address")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label> Area</Label>
                <Input
                  type="text"
                  name="area"
                  className="input w-full border mt-2 form-control"
                  placeholder="Area"
                  onChange={this.onChange}
                  value={area}
                />
                {this.displayValidationErrors("area")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label> City</Label>
                <Input
                  type="text"
                  name="city"
                  className="input w-full border mt-2 form-control"
                  placeholder="city"
                  onChange={this.onChange}
                  value={city}
                />
                {this.displayValidationErrors("city")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label> State</Label>
                <Input
                  type="text"
                  name="state"
                  className="input w-full border mt-2 form-control"
                  placeholder="State"
                  value={state}
                  onChange={this.onChange}
                />
                {this.displayValidationErrors("state")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label> Zip Code</Label>
                <Input
                  type="tel"
                  name="zipCode"
                  className="input w-full border mt-2 form-control"
                  placeholder=" Zip Code "
                  value={zipCode}
                  onChange={this.onChange}
                />
                {this.displayValidationErrors("zipCode")}
              </FormGroup>
            </Col>
            <Col md={6}>
              <div className="filter-sortby">
                <Label>Educational Qualification</Label>
                <div className="sortby-section">
                  <FormGroup>
                    <Label check>
                      <Input
                        type="radio"
                        name="qualification"
                        value="Matriculate"
                        checked={qualification === "Matriculate"}
                        onChange={this.handleChange}
                      />
                      Matriculate
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label check>
                      <Input
                        type="radio"
                        name="qualification"
                        value="Postgraduate"
                        checked={qualification === "Postgraduate"}
                        onChange={this.handleChange}
                      />
                      Post Graduate
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label check>
                      <Input
                        type="radio"
                        name="qualification"
                        value="Undergraduate"
                        checked={qualification === "Undergraduate"}
                        onChange={this.handleChange}
                      />
                      Under Graduate
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label check>
                      <Input
                        type="radio"
                        name="qualification"
                        value="Professional"
                        checked={qualification === "Professional"}
                        onChange={this.handleChange}
                      />
                      Professional Qualified
                    </Label>
                  </FormGroup>
                </div>
                {eduQualError && (
                  <span className="error">
                    Please Select Educational Qualification
                  </span>
                )}
              </div>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Reference</Label>
                <Input
                  type="text"
                  name="reference"
                  className="input w-full border mt-2 form-control"
                  placeholder="Reference"
                  onChange={this.onChange}
                  value={reference}
                />
                {this.displayValidationErrors("reference")}
              </FormGroup>
            </Col>
          </Row>

          <div className="btn-div">
            <Button className="prev-btn btn" onClick={this.onPrev}>
              Prev
            </Button>
            <Button
              type="submit"
              className="next-btn btn"
              disabled={
                memberId ? false : this.isFormValidContactInfo() ? false : true
              }
              // onClick={this.onNext}
            >
              Next
            </Button>
          </div>
        </Form>
      </>
    );
  };
  addInputDumyyItem = () => {
    let { inputs } = this.state;
    inputs.push({ value: "" });
    this.setState({ inputs });
  };
  onChangeInput = (e, handleChange) => {
    this.setState({ [e.target.name]: e.target.value });
    handleChange();
  };
  removeInputs = (index) => {
    this.state.inputs.splice(index, 1);
    this.setState({ inputs: this.state.inputs });
  };
  onInputChange = (e, updateIndex, type) => {
    console.log(e.target.files);
    let inputs = this.state.inputs;

    inputs = inputs.map((eachInput, index) => {
      if (updateIndex === index) {
        if (type === "fullName") {
          return { ...eachInput, fullName: e.target.value };
        } else if (type === "relationType") {
          return { ...eachInput, relationType: e.target.value };
        } else {
          return { ...eachInput, idNumber: e.target.value };
        }
      } else {
        return { ...eachInput };
      }
    });
    console.log(inputs);
    this.setState({ inputs });
  };
  familyMembers = (event) => {
    // event.preventDefault()
    const { inputs } = this.state;
    let familyMembers = inputs;
    console.log(familyMembers);
    this.setState({ familyMembers });
    this.onNext();
  };
  thirdInfo = () => {
    const { inputs, adminComment, memberId, termsAndCondition } = this.state;
    return (
      <>
        <div className="third-info">
          <Label className="label-name section-heading">
            Family Members
          </Label>
          {/* {memberId && (
            <Row>
              <Col md={6}>
                <FormGroup>
                  <input
                    type="text"
                    name={"adminComment"}
                    className="input w-full border mt-2 form-control"
                    value={adminComment}
                    onChange={this.handleChangePayment}
                    placeholder="Enter Admin Comment"
                  />
                </FormGroup>
              </Col>
            </Row>
          )} */}
          {inputs.map((eachInput, index) => {
            return (
              <div key={index}>
                <Row>
                  <Col md={3}>
                    <FormGroup>
                      <input
                        type="text"
                        name={"FullName" + index}
                        className="form-control "
                        value={eachInput.fullName ? eachInput.fullName : ""}
                        onChange={(e) => {
                          this.onInputChange(e, index, "fullName");
                        }}
                        placeholder="Full Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <input
                        type="text"
                        name={"relationType" + index}
                        className="form-control "
                        value={
                          eachInput.relationType ? eachInput.relationType : ""
                        }
                        onChange={(e) => {
                          this.onInputChange(e, index, "relationType");
                        }}
                        placeholder="Relation"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <input
                        type="text"
                        name={"idNumber" + index}
                        className="form-control "
                        value={eachInput.idNumber ? eachInput.idNumber : ""}
                        onChange={(e) => {
                          this.onInputChange(e, index, "idNumber");
                        }}
                        placeholder="ID Number"
                      />
                    </FormGroup>
                  </Col>

                  <Col
                    md={3}
                    style={{
                      display: "flex",
                    }}
                  >
                    <div className="text-center icon-section mt-1">
                      <i
                        className="fa fa-close circle-icon-close"
                        onClick={
                          inputs.length > 1
                            ? () => this.removeInputs(index)
                            : ""
                        }
                      />
                      &nbsp;&nbsp;
                      <i
                        className="fa fa-plus circle-icon"
                        onClick={this.addInputDumyyItem}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Col md={12}>
            <FormGroup>
              <input
                type="checkbox"
                name="termsAndCondition"
                onChange={(e) =>
                  this.setState({ termsAndCondition: e.target.checked })
                }
                checked={termsAndCondition}
              />
              <Label style={{ marginLeft: 20 }}>
                I accept terms and conditions and privacy policy
              </Label>
              {this.displayValidationErrors("termsAndCondition")}
            </FormGroup>
          </Col>
        </div>

        {false ? (
          <div className="btn-div">
            <Button className="prev-btn btn">Approve</Button>
            <Button
              type="submit"
              className="next-btn btn"
              // onClick={this.submitDetails}
            >
              Reject
            </Button>
          </div>
        ) : (
          <div className="btn-div">
            {this.state.addingMemberDetails ? (
                  <ScaleLoader size={40} color={"#253c80"} />
                ) : (
                  <Fragment>
                    <Button className="prev-btn btn" onClick={this.onPrev}>
                      Prev
                    </Button>
                    <Button
                      type="submit"
                      className="next-btn btn"
                      onClick={() => this.addMembership()}
                    >
                      Submit
                    </Button>
                  </Fragment>
                )
              }
          </div>
        )}
      </>
    );
  };
  toggleMemberPlan = (tab, selectedPlan) => {
    if (this.state.activePlan !== tab)
      this.setState({
        activePlan: tab,
        planTypeId: selectedPlan.planTypeId,
        selectedPlan,
      });
    // this.onNext()
  };

  handleChangePayment = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e);
  };
  onChangeFileHandlerPayment = (e) => {
    let finalValue = e.target.files[0];
    finalValue["field"] = e.target.name;
    this.setState({
      [e.target.name]: finalValue,
    });
    // this.setState({
    //   [e.target.name]: e.target.files
    // })
    let thisView = this;
    let file1 = Array.from(e.target.files);
    thisView.setState({ paymentFiles: file1 });
  };
  paymentFiles = () => {
    const { paymentFiles } = this.state;
    if (paymentFiles.length === 0) {
      return null;
    }
    return (
      <p
        style={{
          marginBottom: "0rem",
          paddingLeft: "4px",
          display: "inline-block",
        }}
      >
        file({paymentFiles.length})
      </p>
    );
  };
  submitDetails = () => {
    this.setState({ paymentOption: true, formDetails: false });
  };
  addMembership = () => {
    const { selectedPayment, transaction, paymentFiles } = this.state;
    let paymentMethod = {
      selectedPayment: selectedPayment,
      transaction: transaction ? transaction : "",
      paymentFiles: paymentFiles ? paymentFiles : "",
    };
    console.log(paymentMethod);
    this.setState({ paymentMethod });

    
    let profileData = {
      profilePhoto: '',
      idProof: '',
      name: this.state.fullName,
      fullName: this.state.fullName,
      fatherName: this.state.fatherSpouseName,
      email: this.state.email,
      dateOfBirth: this.state.date,
      aadhar: this.state.adhaar,
      gender: this.state.gender,
      maritalStatus: this.state.maritalStatus,
      mobileNo: this.state.mobile_no,
      contactNumber: this.state.mobile_no,
      address: this.state.address,
      area: this.state.area,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode,
      qualification: this.state.qualification,
      relationType: this.state.relation,
      reference: this.state.reference
    };

    let familyList = [];
    if(this.state.inputs && this.state.inputs.length > 0){
      this.state.inputs.map((eachFamilyMember) => {
        if(eachFamilyMember.fullName && eachFamilyMember.fullName !== '')
          familyList.push({ name: eachFamilyMember.fullName, relation: eachFamilyMember.relationType, id: eachFamilyMember.idNumber });
      })
    }
    profileData.familyMembers = JSON.stringify(familyList);


    const { profile, adhaarPhoto, paymentScreenShoot } = this.state;
    let uploadFiles = [];
    let uploadLabels = [];
    if(profile){
      uploadFiles.push(profile);
      uploadLabels.push("profile");
    } else {
      profileData.profilePhoto = this.state.profileImage;
    }

    if(adhaarPhoto){
      uploadFiles.push(adhaarPhoto);
      uploadLabels.push("adhaarPhoto");
    } else {
      profileData.idProof = this.state.adhaarImage;
    }

    if(paymentScreenShoot){
      uploadFiles.push(paymentScreenShoot);
      uploadLabels.push("paymentScreenShoot");
    } else {

    }

    if(uploadLabels.length > 0)
      this.fileUpload(uploadFiles, uploadLabels, profileData);
    else {
      if (this.state.memberId) 
        this.updateMember(profileData);
      else 
        this.insertMember(profileData);
    }
    
    //this.toggleSubmitModal();
  };
  toggleSubmitModal = () => {
    this.setState({
      toggleModal: !this.state.toggleModal,
    });
  };

  render() {
    const {
      stepCount,
      paymentOption,
      formDetails,
      selectedPayment,
      transaction,
      paymentFiles,
      toggleModal,
      member_id,
      addingMemberDetails,
      memberId,
    } = this.state;

    return (
      <div className="col-span-12 membership-form">
        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="intro-y col-span-12 lg:col-span-10">
            <div className="intro-y box">
              <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200">
                <h2 className="font-medium text-base mr-auto">
                  Membership Form
                </h2>
              </div>

              <div className="p-5" id="vertical-form">
                {formDetails && (
                  <div className="full-width">
                    <h3 className="inner-heading">
                      {" "}
                      Membership Application Form 3 Steps
                    </h3>
                    <ul className="timeline" id="timeline">
                      <li className={`${stepCount === 1 ? "complete" : ""} li`}>
                        <div className="timestamp"></div>
                        <div className="status">
                          <div class="numberCircle">1</div>
                        </div>
                      </li>
                      <li className={`${stepCount === 2 ? "complete" : ""} li`}>
                        <div className="timestamp"></div>
                        <div className="status">
                          <div class="numberCircle">2</div>
                        </div>
                      </li>
                      <li className={`${stepCount === 3 ? "complete" : ""} li`}>
                        <div className="timestamp"></div>
                        <div className="status">
                          <div class="numberCircle">3</div>
                        </div>
                      </li>
                    </ul>
                    {stepCount === 1
                      ? this.personalInfo()
                      : stepCount === 2
                      ? this.contactInfo()
                      : stepCount === 3
                      ? this.thirdInfo()
                      : ""}
                  </div>
                )}
                {paymentOption && (
                  <div className="full-width">
                    <h3 className="inner-heading"> Payment</h3>

                    <div className="third-info">
                      <Row>
                        <Col md={6}>
                          <div className="filter-sortby">
                            <div className="sortby-section">
                              <FormGroup>
                                <Label check>
                                  <input
                                    type="radio"
                                    name="selectedPayment"
                                    value="Online Payment"
                                    checked={
                                      selectedPayment === "Online Payment"
                                    }
                                    onChange={this.handleChangePayment}
                                  />
                                  Online Payment
                                </Label>
                                {selectedPayment === "Online Payment" && (
                                  <>
                                    <FormGroup>
                                      <input
                                        type="text"
                                        name={"transaction"}
                                        className="input w-full border mt-2 form-control"
                                        value={transaction}
                                        onChange={this.handleChangePayment}
                                        placeholder="Transaction ID"
                                      />
                                    </FormGroup>
                                    <FormGroup>
                                      <label
                                        for="file-upload-payment"
                                        style={{ marginLeft: "5px" }}
                                        className="custom-file-upload-screen mt-2"
                                      >
                                        <i className="text-info fa fa-cloud-upload"></i>{" "}
                                        Upload Screen Shoot
                                      </label>
                                      <input
                                        type="file"
                                        id="file-upload-payment"
                                        name="paymentScreenShoot"
                                        accept="image/*"
                                        onChange={
                                          this.onChangeFileHandlerPayment
                                        }
                                      />
                                      {this.paymentFiles()}
                                      {paymentFiles &&
                                        paymentFiles.map((files, index) => (
                                          <p style={{ marginBottom: "0rem" }}>
                                            {files.name}
                                          </p>
                                        ))}
                                    </FormGroup>
                                  </>
                                )}
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type="radio"
                                    name="selectedPayment"
                                    value="Wallet Payment"
                                    checked={
                                      selectedPayment === "Wallet Payment"
                                    }
                                    onChange={this.handleChangePayment}
                                  />
                                  Wallet Payment
                                </Label>
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type="radio"
                                    name="selectedPayment"
                                    value="COD Delivery"
                                    checked={selectedPayment === "COD Delivery"}
                                    onChange={this.handleChangePayment}
                                  />
                                  COD Delivery
                                </Label>
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type="radio"
                                    name="selectedPayment"
                                    value="Free Camp"
                                    checked={selectedPayment === "Free Camp"}
                                    onChange={this.handleChangePayment}
                                  />
                                  Free Camp
                                </Label>
                              </FormGroup>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="btn-div">
                      {addingMemberDetails ? (
                        <ScaleLoader size={40} color={"#253c80"} />
                      ) : (
                        <Button
                          type="submit"
                          className="next-btn"
                          onClick={memberId ? "" : this.addMembership}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Modal isOpen={toggleModal} className="add-modal">
                <ModalBody style={{ backgroundColor: "#fff" }}>
                  <div className="">
                    <div className="col-span-12">
                      <Row className="lg-close">
                        <VscClose
                          className="close-icon"
                          onClick={() => this.toggleSubmitModal("close")}
                        />
                      </Row>

                      <Alert color="success" className="mt-3">
                        Application submitted Successfully you will get SMS and
                        notification once your request approved
                      </Alert>
                      <Alert color="success">
                        Once your request approved you will able to download you
                        MHF card from Home Page
                      </Alert>

                      <Row className="">
                        <Col className="add-button text-right">
                          <Button
                            className="close-button"
                            color="primary"
                            onClick={() => this.toggleSubmitModal("close")}
                          >
                            <span className="text-white"> Close </span>
                          </Button>{" "}
                          {""}{" "}
                        </Col>
                      </Row>
                    </div>
                  </div>{" "}
                </ModalBody>
              </Modal>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MembershipForm);
