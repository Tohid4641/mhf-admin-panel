import React from 'react'
import './contactUsForm.scss'
import Form from 'react-validation/build/form'
import { Button } from 'reactstrap'
import Input from 'react-validation/build/input'
import axios from 'axios'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'
import Translate from 'react-translate-component'

// const required = (value, props) => {
//     if (!value || (props.isCheckable && !props.checked)) {
//         return <span className="form-error is-visible">Required</span>;
//     }
// };

class ContactUsForm extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleClick = this.handleClick.bind(this);
    this.state = {
      id: '',
      mobile_no: '',
      email: '',
      // // role: '',
      // address: '',
      // mobile_no: '',
      // file: '',
      // newfiles: [],
      authenticating: false,
      contactUsUpdate: false,
      contactUsDetails: {}
    }
    this.validators = validators
  }

  componentDidMount () {
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ contactUsUpdate: true })
      this.getContactUs()
    }
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
    this.updateValidators([e.target.name], e.target.value)
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
      if (field === 'contact_no' || field === 'email') {
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

  // onChangeFileHandler = (e) => {
  //     this.setState({
  //         [e.target.name]: e.target.files,
  //     });
  //     let thisView = this;
  //     let file1 = Array.from(e.target.files);
  //     thisView.setState({ newfiles: file1 });
  // }

  // numberoffile = () => {
  //     const { newfiles } = this.state;
  //     if (newfiles.length === 0) {
  //         return null;
  //     }
  //     return (
  //         <p style={{ marginBottom: "0rem", paddingLeft: "4px", display: "inline-block" }}>file({newfiles.length})</p>

  //     )
  // }

  handleSubmit (event) {
    event.preventDefault()
    this.setState({ authenticating: true })
    this.updateContactUs()
  }

  updateContactUs = () => {
    const { mobile_no, email } = this.state

    let data = mobile_no + '||||' + email //JSON.stringify({ "mobileNo": mobile_no, "email" : email});
    var thisView = this
    this.setState({ authenticating: true })

    axios
      .all([adminService.updateContactUs(data)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.props.history.push('/contactUs')
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in MLA profile')
      })
  }

  getContactUs = () => {
    var thisView = this
    axios
      .all([adminService.getContactUs()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let contactUsDetails = resData.data
            let mobileNo = contactUsDetails.mobileNo
            mobileNo = mobileNo.split('||||')
            let mobile_no = mobileNo[0]
            let email = mobileNo[1]

            let validate = { mobile_no, email }
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({ mobile_no, email })
            console.log('updated')
            thisView.setState({ contactUsDetails })
            thisView.setState({ Success_msg: '' })
          } else {
            thisView.setState({ apiError: resData })
          }
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  render () {
    const { authenticating } = this.state

    return (
      <div className='col-span-12 mla-contacts-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-11'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  <Translate content='contactUs' />
                </h2>
              </div>
              <div className='p-4' id='vertical-form'>
                <div className='preview'>
                  <Form onSubmit={this.handleSubmit}>
                    <div className='intro-y box'>
                      <div className='p-5' id='vertical-form'>
                        <div className='preview'>
                          <div>
                            <label>
                              {' '}
                              <Translate content='mobile no' />
                            </label>
                            <Input
                              type='text'
                              name='mobile_no'
                              className='input w-full border mt-2 form-control'
                              placeholder='Mobile No'
                              // validations={[required]}
                              value={this.state.mobile_no}
                              onChange={this.onChange}
                            />
                            {this.displayValidationErrors('contact_no')}
                          </div>
                          <div className='mt-3'>
                            <label>
                              {' '}
                              <Translate content='email' />
                            </label>
                            <Input
                              type='text'
                              name='email'
                              className='input w-full border mt-2 form-control'
                              placeholder='Email'
                              // validations={[required]}
                              onChange={this.onChange}
                              value={this.state.email}
                            />
                            {this.displayValidationErrors('email')}
                          </div>

                          {!authenticating ? (
                            <Button
                              className=' btn btn-primary mt-3'
                              color='primary'
                              type='submit'
                              disabled={this.isFormValid() ? false : true}
                            >
                              {this.state.contactUsUpdate ? (
                                <span className='text-white'>
                                  {' '}
                                  <Translate content='update' />
                                </span>
                              ) : (
                                <span className='text-white'>
                                  {' '}
                                  <Translate content='publish' />
                                </span>
                              )}{' '}
                            </Button>
                          ) : (
                            <i className='fa fa-spin fa-refresh authentication-loading' />
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ContactUsForm
