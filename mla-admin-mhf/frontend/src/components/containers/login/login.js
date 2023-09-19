import React from 'react'
import './login.scss'
import {
  Col,
  Card,
  Alert,
  FormGroup,
  Button,
  Container,
  CardBody
} from 'reactstrap'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import validators from '../../validators/validators'
import axios from 'axios'
import { connect } from 'react-redux'

import adminService from '../../services/adminService'
import * as Storage from '../../services/localstorage'

import { authenticate } from '../../../store/actions/auth'

class Login extends React.Component {
  constructor (props) {
    super(props)
    // this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleClick = this.handleClick.bind(this);

    this.state = {
      email: '',
      password: '',
      otp: '',
      Errormsg: '',
      mobile_no: '',
      mobileData: '',
      sendotp: true,
      otp_verification: false,
      authenticating: false,
      authenticating_resend: false,
      validateSession: false
    }
    this.validators = validators
  }

  componentDidMount () {
    // thisView = this;
    let key = Storage.authKey
    let authData = Storage.get(key)
    if (authData && authData !== '') {
      authData = JSON.parse(authData)
      this.props.updatingAuthenticate({
        token: authData.token,
        mobileNo: authData.mobileNo,
        profile: authData
      })
      this.props.history.push('home')
    } else {
      this.setState({ validateSession: true })
    }
  }

  updateValidators = (fieldName, value) => {
    this.validators[fieldName].errors = []
    this.validators[fieldName].state = value
    this.validators[fieldName].valid = true
    this.validators[fieldName].rules.forEach(rule => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message)
          this.validators[fieldName].valid = false
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message)
          this.validators[fieldName].valid = false
        }
      }
    })
  }

  isFormValid = () => {
    let status = true
    Object.keys(this.validators).forEach(field => {
      if (field === 'mobile_no') {
        if (!this.validators[field].valid) {
          status = false
        }
      }
    })
    return status
  }

  isFormValid_varification = () => {
    let status = true
    Object.keys(this.validators).forEach(field => {
      if (field === 'otp') {
        if (!this.validators[field].valid) {
          status = false
        }
      }
    })
    return status
  }

  displayValidationErrors = fieldName => {
    const validator = this.validators[fieldName]
    const result = ''
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className='error' key={index}>
            * {info}
            <br />
          </span>
        )
      })
      return <div className='col s12 row'>{errors}</div>
    }
    return result
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    this.updateValidators([e.target.name], e.target.value)
  }

  handleSubmit (event) {
    // console.log(this.state);
    event.preventDefault()
    this.setState({ authenticating: true })

    // if (this.state.mobile_no === '12345678') {

    //     this.props.history.push("/home");
    // }

    // else {

    //     // alert("Please Enter Correct Email or Password");
    //     Errormsg1.setState({ Errormsg: "Please Enter Correct Email or Password" })
    // }
    // thisView.setState({ authenticating: false });

    this.Admin_send_otp()
  }

  Admin_send_otp = location => {
    const { mobile_no } = this.state
    var thisView = this

    if (location && location === 'resend') {
      this.setState({ authenticating_resend: true })
    }

    axios
      .all([adminService.Admin_send_otp(mobile_no)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            // let mobileNUmber = resData.data.mobileNo
            // Storage.set("otpDetail", JSON.stringify({ otpresponse: resData.data }));

            thisView.setState({ sendotp: false, otp_verification: true })

            // thisView.setState({ mobileData: mobileNUmber })
          } else {
            thisView.setState({ Errormsg: resData.message })
          }
        }
        thisView.setState({ authenticating: false })
        if (location && location === 'resend') {
          thisView.setState({ authenticating_resend: false })
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in Admin_send_otp')
      })
  }

  AdminOtp_verification = event => {
    event.preventDefault()
    this.setState({ authenticating: true })
    // let otpresponse = window.localStorage.getItem("otpDetail");
    // let otpDetail = JSON.parse(otpresponse);
    // let mobileNo = otpDetail.otpresponse.mobileNo;
    // console.log(mobileNo);

    const { mobile_no, otp } = this.state
    var thisView = this
    axios
      .all([adminService.AdminOtp_verification(mobile_no, otp)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let authData = resData.data
            let key = Storage.authKey
            Storage.set(key, JSON.stringify(authData))

            thisView.props.updatingAuthenticate({
              token: authData.token,
              mobileNo: authData.mobileNo,
              profile: authData
            })

            thisView.props.history.push('home')
          } else {
            // thisView.setState({ Errormsg: resData.message });
            thisView.setState({ Errormsg: 'Enter Correct OTP' })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message)
          console.log('An error occurred in AdminOtp_verification')
      })
  }

  render () {
    const {
      Errormsg,
      authenticating,
      authenticating_resend,
      sendotp,
      otp_verification,
      validateSession
    } = this.state

    return (
      <div className='col-span-12 mla-login' style={{ flex: '1 1' }}>
        <div className='col-span-12 xxl:col-span-9'>
          <Container>
            <Col md={4} className='mx-auto' style={{ padding: '65px 0' }}>
              <Card
                className=' card-statistics mb-30'
                style={{
                  borderRadius: '0rem !important',
                  boxShadow: '0px 8px 36px #222'
                }}
              >
                <CardBody>
                  <div
                    className='mx-auto mla-logo-cont'
                    style={{ textAlign: 'center' }}
                  >
                    {/* <img src={mlaLogo} className="mla-logo" alt="img" /> */}
                    <span className='mhf-text'>MHF</span>
                  </div>

                  {/* <div className="mx-auto" style={{ textAlign: "center" }}> */}
                  {sendotp && validateSession && (
                    <div className='sendotp'>
                      <div>
                        <h2
                          className='font-weight-bold'
                          style={{ fontSize: '22px' }}
                        >
                          {' '}
                          Sign In
                        </h2>
                      </div>
                      <br></br>
                      {/* {this.state.mobileData && <p>{this.state.mobileData}</p>} */}

                      <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                          <Input
                            type='text'
                            name='mobile_no'
                            // validations={[required, email]}
                            className='form-control'
                            onChange={this.onChange}
                            value={this.state.mobile_no}
                            placeholder='Enter Mobile Number'
                          />
                          {this.displayValidationErrors('mobile_no')}
                        </FormGroup>
                        <h2
                          className='font-weight-bold'
                          style={{ fontSize: '12px', textAlign: 'center' }}
                        >
                          {' '}
                          We Will Send One Time Password ( OTP ) to your mobile
                          number
                        </h2>

                        {!authenticating ? (
                          <Button
                            className=' btn btn-primary mt-3'
                            style={{
                              padding: '0.375rem 1.75rem',
                              borderRadius: '1.25rem'
                            }}
                            color='primary'
                            type='submit'
                            disabled={this.isFormValid() ? false : true}
                          >
                            <span className='text-white'>Send OTP</span>
                          </Button>
                        ) : (
                          <i className='fa fa-spin fa-refresh authentication-loading' />
                        )}
                      </Form>
                    </div>
                  )}

                  {otp_verification && (
                    <div className='otp-verification'>
                      <div>
                        <h2
                          className='font-weight-bold'
                          style={{ marginBottom: '5px', fontSize: '22px' }}
                        >
                          {' '}
                          OTP Verification
                        </h2>
                      </div>
                      <h2
                        className='font-weight-bold'
                        style={{ fontSize: '12px' }}
                      >
                        Enter the OTP you Received to
                      </h2>
                      {this.state.mobileData && (
                        <h2
                          className='font-weight-bold'
                          style={{ fontSize: '12px', paddingTop: '4px' }}
                        >
                          +91-{this.state.mobileData}
                        </h2>
                      )}
                      <br></br>

                      {Errormsg && (
                        <div className='errormsg'>
                          <Alert color='danger'>{Errormsg}</Alert>
                        </div>
                      )}

                      <Form onSubmit={this.AdminOtp_verification}>
                        <FormGroup>
                          {/* <Label>OTP</Label> */}
                          <Input
                            type='password'
                            className='form-control'
                            name='otp'
                            onChange={this.onChange}
                            value={this.state.otp}
                            placeholder='Enter OTP'
                          />
                          {this.displayValidationErrors('otp')}
                        </FormGroup>

                        <h2
                          className='font-weight-bold'
                          style={{ fontSize: '12px', textAlign: 'center' }}
                        >
                          If you didn't receive a code !&nbsp;
                          {!authenticating_resend ? (
                            <span
                              style={{ cursor: 'pointer', color: '#007bff' }}
                              onClick={() => {
                                this.Admin_send_otp('resend')
                              }}
                            >
                              Resend
                            </span>
                          ) : (
                            <i className='fa fa-spin fa-refresh authentication-loading' />
                          )}
                        </h2>
                        {!authenticating ? (
                          <Button
                            className=' btn btn-primary mt-3'
                            style={{
                              padding: '0.375rem 1.75rem',
                              borderRadius: '1.25rem'
                            }}
                            color='primary'
                            type='submit'
                            disabled={
                              this.isFormValid_varification() ? false : true
                            }
                          >
                            <span className='text-white'>Sign In</span>
                          </Button>
                        ) : (
                          <i className='fa fa-spin fa-refresh authentication-loading' />
                        )}
                      </Form>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({
  updatingAuthenticate (data) {
    dispatch(authenticate(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
