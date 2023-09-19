import React from 'react';
import './addHospital.scss';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import axios from 'axios';
import adminService from '../../services/adminService';
import validators from '../../validators/validators';
import { connect } from 'react-redux';
import { Row, Col, Label, FormGroup, Button } from 'reactstrap';
class AddHospital extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDetail: false,
      updateHospital: false,
      hospitalId: '',
      name: '',
      address: '',
      about: '',
      contact:'',
      services: [{ serviceName: '' }]
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
        field === 'name' ||
        field === 'address'
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
    var thisView = this;
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ updateHospital: true });
      let hospitalId = this.props.match.params.hospitalId;
      if (hospitalId) {
        this.setState({ hospitalId: hospitalId });
        this.getHospitalDetails(hospitalId);
      }
    }
  }
  getHospitalDetails = (hospitalId) => {
    var thisView = this;
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
              hospitalDetails.list_of_services_the_hospital_provides
                ? JSON.parse( hospitalDetails.list_of_services_the_hospital_provides ) : [{ serviceName: '' }];
            let name = hospitalDetails.name_of_hospital;
            let whatKindOfHospital = hospitalDetails.what_kind_of_hospital;
            let address = hospitalDetails.address_of_hospital;
            let about = hospitalDetails.about_the_hospital;
            let timingsOfHospital = hospitalDetails.timings_of_hospital;
            let contact = hospitalDetails.contact;
            let services = [];
            if(hospitalDetails.list_of_services_the_hospital_provides && hospitalDetails.list_of_services_the_hospital_provides.length > 0){
              services = hospitalDetails.list_of_services_the_hospital_provides.map(
                (eachService, index) => {
                  return {
                    ...eachService,
                    serviceName: eachService && eachService,
                    sNo: 1 + index
                  };
                }
              );
            } else {
              services = [{ serviceName: '' }];
            }
            
            let validate = {
              name: name,
              whatKindOfHospital: whatKindOfHospital,
              timingsOfHospital: timingsOfHospital,
              address: address,
              about: about,
              contact: contact
            };
            Object.keys(validate).map((key) => {
              thisView.updateValidators([key], validate[key]);
              return true;
            });
            thisView.setState({
              name,
              whatKindOfHospital,
              timingsOfHospital,
              address,
              about,
              services,
              contact
            });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message)
          console.log('An error occurred in Get Hospital Detail');
      });
  };

  addHospital = (event) => {
    event.preventDefault();
    this.setState({ addingDetails: true });
    const {
      name,
      whatKindOfHospital,
      timingsOfHospital,
      address,
      about,
      services,
      contact
    } = this.state;
    var thisView = this;
    let finalservices = [];
    services.map((eachService) => {
      if (eachService.serviceName) finalservices.push(eachService.serviceName);
      return true;
    });
    let details = {
      name_of_hospital: name,
      contact: contact !== '' ? contact : '-',
      what_kind_of_hospital: whatKindOfHospital !== '' ? whatKindOfHospital : '-',
      address_of_hospital: address !== '' ? address : '-',
      about_the_hospital: about !== '' ? about : '-',
      list_of_services_the_hospital_provides: finalservices
        ? JSON.stringify(finalservices)
        : '[]',
      timings_of_hospital: timingsOfHospital !== '' ? timingsOfHospital : '-'
    };
    axios
      .all([adminService.addHospital(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0];
          if (resData) {
            thisView.props.history.push('/hospitals-facilities');
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ addingDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in Add Hospital');
      });
  };

  updateHospital = (event) => {
    event.preventDefault();
    const {
      name,
      whatKindOfHospital,
      timingsOfHospital,
      address,
      about,
      services,
      contact
    } = this.state;
    var thisView = this;
    let finalservices = [];

    services.map((eachService) => {
      if (eachService.serviceName) finalservices.push(eachService.serviceName);
      return true;
    });

    thisView.setState({ updateDetail: true });
    let hospitalId = this.props.match.params.hospitalId;
    let details = {
      hospital_id: hospitalId,
      name_of_hospital: name !== '' ? name : '-',
      contact: contact !== '' ? contact : '-',
      what_kind_of_hospital: whatKindOfHospital !== '' ? whatKindOfHospital : '-',
      address_of_hospital: address !== '' ? address : '-',
      about_the_hospital: about !== '' ? about : '-',
      list_of_services_the_hospital_provides: finalservices
        ? JSON.stringify(finalservices)
        : '[]',
      timings_of_hospital: timingsOfHospital !== '' ? timingsOfHospital : '-'
    };
    axios
      .all([adminService.updateHospital(details)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            if(hospitalId)
              thisView.props.history.push('/hospitals-facilities/'+hospitalId);
            else
              thisView.props.history.push('/hospitals-facilities');
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

  addInputDumyyItem = () => {
    let { services } = this.state;
    services.push({ value: '' });
    this.setState({ services });
  };

  removeInputs = (index) => {
    this.state.services.splice(index, 1);
    this.setState({ services: this.state.services });
  };
  onInputChange = (e, updateIndex, type) => {
    let { services } = this.state;
    services = services.map((eachInput, index) => {
      if (updateIndex === index) {
        if (type === 'serviceName') {
          return { ...eachInput, serviceName: e.target.value };
        }
      } else {
        return { ...eachInput };
      }
      return true;
    });
    this.setState({ services });
  };
  render() {
    const {
      addingDetails,
      updateDetail,
      name,
      whatKindOfHospital,
      timingsOfHospital,
      address,
      about,
      hospitalId,
      services,
      contact
    } = this.state;

    return (
      <div className='col-span-12 add-hospital'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  {' '}
                  {hospitalId ? 'Update' : 'Add'} Hospital
                </h2>
              </div>

              <div className='p-5' id='vertical-form'>
                <Form
                  onSubmit={hospitalId ? this.updateHospital : this.addHospital}
                >
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
                        <Label> Address</Label>
                        <Input
                          type='text'
                          name='address'
                          className='input w-full border mt-2 form-control'
                          placeholder='Address'
                          onChange={this.onChange}
                          value={address}
                        />
                        {/* {this.displayValidationErrors('address')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> Contact</Label>
                        <Input
                          type='text'
                          name='contact'
                          className='input w-full border mt-2 form-control'
                          placeholder='contact'
                          onChange={this.onChange}
                          value={contact}
                        />
                        {/* {this.displayValidationErrors('address')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label> What Kind Of Hospital</Label>
                        <Input
                          type='text'
                          name='whatKindOfHospital'
                          className='input w-full border mt-2 form-control'
                          placeholder=' What Kind Of Hospital'
                          onChange={this.onChange}
                          value={whatKindOfHospital}
                        />
                        {/* {this.displayValidationErrors('whatKindOfHospital')} */}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Timings Of Hospital</Label>
                        <Input
                          type='text'
                          name='timingsOfHospital'
                          className='input w-full border mt-2 form-control'
                          placeholder='Timings Of Hospital'
                          onChange={this.onChange}
                          value={timingsOfHospital}
                        />
                        {/* {this.displayValidationErrors('timingsOfHospital')} */}
                      </FormGroup>
                    </Col>
                    <Col md={9}>
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
                  <Row>
                    <Col md={9}>
                      <Label> Serivces</Label>
                    </Col>
                  </Row>

                  {services.map((eachInput, index) => {
                    return (
                      <div key={index}>
                        <Row>
                          <Col md={9}>
                            <FormGroup>
                              <input
                                type='text'
                                name={'FullName' + index}
                                className='form-control '
                                value={
                                  eachInput.serviceName
                                    ? eachInput.serviceName
                                    : ''
                                }
                                onChange={(e) => {
                                  this.onInputChange(e, index, 'serviceName');
                                }}
                                placeholder='Service'
                              />
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <div className='icon-section mt-1'>
                              <i
                                className='fa fa-close circle-icon-close'
                                onClick={
                                  services.length > 1
                                    ? () => this.removeInputs(index)
                                    : ''
                                }
                              />
                              &nbsp;&nbsp;
                              <i
                                className='fa fa-plus circle-icon'
                                onClick={this.addInputDumyyItem}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

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
                        {hospitalId ? 'Update' : 'Submit'}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddHospital);
