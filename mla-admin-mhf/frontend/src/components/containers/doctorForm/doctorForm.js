import React from 'react';
import './doctorForm.scss';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import axios from 'axios';
import adminService from '../../services/adminService';
import validators from '../../validators/validators';
import { connect } from 'react-redux';
import { Row, Col, Label, FormGroup, Button } from 'reactstrap';
class DoctorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDetail: false,
      doctorId: '',

      name: '',
      designation: '',
      specialisation: '',
      hospitalName: '',
      about: '',
      contact: ''
    };
    this.validators = validators;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.updateValidators([e.target.name], e.target.value);
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
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  };
  isFormValid = () => {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (
        field === 'name'
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
    const result = '';
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className='error' key={index}>
            * {info}
            <br />
          </span>
        );
      });
      return <div className='col s12 row'>{errors}</div>;
    }
    return result;
  };
  componentDidMount() {
    if (this.props.location.pathname.indexOf('update') > -1) {
      let doctorId = this.props.match.params.doctorId;
      if (doctorId) {
        this.setState({ doctorId: doctorId });
        this.getDoctorDetails(doctorId);
      }
    }
  }
  getDoctorDetails = (doctorId) => {
    var thisView = this;
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
            let name = doctorDetails.name_of_doctor;
            let designation = doctorDetails.designation;
            let specialisation = doctorDetails.qualification;
            let hospitalName = doctorDetails.list_of_hospitals_working;
            let about = doctorDetails.about_doctor;
            let contact = doctorDetails.contact;
            let validate = {
              name: name,
              designation: designation,
              specialisation: specialisation,
              hospitalName: hospitalName,
              about: about
            };
            Object.keys(validate).map((key) => {
              thisView.updateValidators([key], validate[key]);
              return true;
            });
            thisView.setState({
              name,
              designation,
              specialisation,
              hospitalName,
              about,
              contact
            });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Get Doctor Detail');
      });
  };

  addDoctor = (event) => {
    event.preventDefault();
    this.setState({ addingDetails: true });
    const { name, about, designation, specialisation, hospitalName, contact } =
      this.state;
    var thisView = this;
    let details = {
      name_of_doctor: name,
      contact: contact !== '' ? contact : '-',
      designation: designation !== '' ? designation : '-',
      // specialisation: specialisation,
      list_of_hospitals_working: hospitalName !== '' ? hospitalName : '-',
      qualification: specialisation !== '' ? specialisation : '-',
      about_doctor: about !== '' ? about : '-',
    };
    axios
      .all([adminService.addDoctor(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          if (resData) {
            thisView.props.history.push('/doctors');
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ addingDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Add Doctor');
      });
  };

  updateDoctor = (event) => {
    event.preventDefault();
    const { name, designation, specialisation, hospitalName, about, contact } =
      this.state;
    var thisView = this;
    thisView.setState({ updateDetail: true });
    let doctorId = this.props.match.params.doctorId;
    let details = {
      doctor_id: doctorId,
      name_of_doctor: name,
      contact: contact !== '' ? contact : '-',
      designation: designation !== '' ? designation : '-',
      // specialisation: specialisation,
      list_of_hospitals_working: hospitalName !== '' ? hospitalName : '-',
      qualification: specialisation !== '' ? specialisation : '-',
      about_doctor: about !== '' ? about : '-',
    };
    axios
      .all([adminService.updateDoctor(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            thisView.props.history.push('/doctors');
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ updateDetail: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message)
          console.log('An error occurred in Update Hopital Detail');
      });
  };

  render() {
    const {
      addingDetails,
      updateDetail,
      name,
      designation,
      specialisation,
      hospitalName,
      about,
      doctorId,
      contact
    } = this.state;

    return (
      <div className='col-span-12 doctor-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  {' '}
                  {doctorId ? 'Update' : 'Add'} Doctor
                </h2>
              </div>

              <div className='p-5' id='vertical-form'>
                <Form onSubmit={doctorId ? this.updateDoctor : this.addDoctor}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Name</Label>
                        <Input
                          type='text'
                          name='name'
                          className='input w-full border mt-2 form-control'
                          placeholder=' Name'
                          onChange={this.onChange}
                          value={name}
                        />
                        {this.displayValidationErrors('name')}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Hospital Name</Label>
                        <Input
                          type='text'
                          name='hospitalName'
                          className='input w-full border mt-2 form-control'
                          placeholder=' Hospital Name'
                          onChange={this.onChange}
                          value={hospitalName}
                        />
                        {/* {this.displayValidationErrors('hospitalName')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Contact</Label>
                        <Input
                          type='text'
                          name='contact'
                          className='input w-full border mt-2 form-control'
                          placeholder='Contact'
                          onChange={this.onChange}
                          value={contact}
                        />
                        {/* {this.displayValidationErrors('contact')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Designation</Label>
                        <Input
                          type='text'
                          name='designation'
                          className='input w-full border mt-2 form-control'
                          placeholder=' Designation'
                          onChange={this.onChange}
                          value={designation}
                        />
                        {/* {this.displayValidationErrors('designation')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Qualification</Label>
                        <Input
                          type='text'
                          name='specialisation'
                          className='input w-full border mt-2 form-control'
                          placeholder='Qualification'
                          onChange={this.onChange}
                          value={specialisation}
                        />
                        {/* {this.displayValidationErrors('specialisation')} */}
                      </FormGroup>
                    </Col>
                    
                    <Col md={6}>
                      <FormGroup>
                        <Label> About</Label>
                        <Input
                          type='text'
                          name='about'
                          className='input w-full border mt-2 form-control'
                          placeholder='About'
                          onChange={this.onChange}
                          value={about}
                        />
                        {/* {this.displayValidationErrors('about')} */}
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className='btn-div'>
                    {addingDetails || updateDetail ? (
                      <Button
                        className='next-btn mr-3 '
                        color='primary'
                        disabled
                      >
                        <i className='fa fa-spin fa-refresh submit-loading' />
                      </Button>
                    ) : (
                      <Button
                        type='submit'
                        className='next-btn btn'
                        disabled={this.isFormValid() ? false : true}
                      >
                        {doctorId ? 'Update' : 'Submit'}
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorForm);
