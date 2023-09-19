import React from 'react'
import './contactsForm.scss'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import axios from 'axios'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'
import { Button } from 'reactstrap'
import Translate from 'react-translate-component'

// const required = (value, props) => {
//     if (!value || (props.isCheckable && !props.checked)) {
//         return <span className="form-error is-visible">Required</span>;
//     }
// };

class ContactsForm extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      firstName: '',
      lastName: '',
      newfiles: [],
      role: '',
      address: '',
      mobile_no: '',
      email: '',
      file: '',
      authenticating: false,
      updateContact: false,
      serviceHead: false,
      contactDetails: {}
    }
    this.validators = validators
  }
  componentDidMount () {
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ updateContact: true })

      if (this.props.location.pathname.indexOf('contacts') > -1)
        this.getContactDetails()
      else if (this.props.location.pathname.indexOf('serviceheads') > -1)
        this.getServiceHeadDetails()
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
      if (
        field === 'firstName' ||
        field === 'lastName' ||
        field === 'role' ||
        field === 'address' ||
        field === 'mobile_no' ||
        field === 'email'
      ) {
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

  onChangeFileHandler = e => {
    this.setState({
      [e.target.name]: e.target.files
    })
    let thisView = this
    let file1 = Array.from(e.target.files)
    thisView.setState({ newfiles: file1 })
  }

  numberoffile = () => {
    const { newfiles } = this.state
    if (newfiles.length === 0) {
      return null
    }
    return (
      <p
        style={{
          marginBottom: '0rem',
          paddingLeft: '4px',
          display: 'inline-block'
        }}
      >
        file({newfiles.length})
      </p>
    )
  }

  handleSubmit (event) {
    event.preventDefault()
    // this.form.validateAll();
    this.setState({ authenticating: true })

    this.fileUpload()
    // console.log(this.state)
  }

  // fileUpload() {

  //     const { file, contactDetails } = this.state;
  //     var thisView = this;
  //     axios.all([adminService.fileUploadsingle(file)])
  //         .then(function (res) {
  //             if (res) {

  //                 let resData = res[0].data;
  //                 console.log(resData);
  //                 // let filesReferencesList = [];
  //                 // console.log(filesReferencesList)
  //                 resData.map((eachResponse) => {
  //                     if (eachResponse.filename)
  //                         // filesReferencesList.push(eachResponse.filename);
  //                         console.log(eachResponse.filename);

  //                     // })
  //                     // thisView.insertContact(JSON.stringify(filesReferencesList));

  //                 if (thisView.state.updateContact)
  //                 thisView.updateContactHeadService(JSON.stringify(filesReferencesList));
  //             else
  //                 thisView.insertContact(JSON.stringify(filesReferencesList));

  //                 })

  //             }

  //             // thisView.setState({ authenticating: false });

  //         }).catch(function (res) {
  //             console.log(res);
  //             if (res.message)
  //                 console.log('An error occurred in file upload');
  //         });

  // };

  fileUpload () {
    const { file } = this.state
    var thisView = this
    axios
      .all([adminService.fileUploadsingle(file)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data
          let filesReferencesList = ''
          resData.map(eachResponse => {
            if (eachResponse.filename) {
              // filesReferencesList.push(eachResponse.filename);
              filesReferencesList = eachResponse.filename
            }
            return true
          })

          // if (contactDetails.eventProjectFileNames) {
          //     eventDetails.eventProjectFileNames.map((eachFile) => {

          //         return filesReferencesList.push(eachFile);
          //     })
          // }

          if (thisView.state.updateContact)
            thisView.updateContactHeadService(filesReferencesList)
          else thisView.insertContact(filesReferencesList)
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  insertContact = fileName => {
    const { firstName, lastName, role, address, mobile_no, email } = this.state
    var thisView = this

    let insertType = ''
    if (this.props.location.pathname.indexOf('serviceheads') > -1)
      insertType = 'headOfService'

    this.setState({ authenticating: true })
    axios
      .all([
        adminService.insertContact(
          firstName,
          lastName,
          role,
          address,
          mobile_no,
          email,
          fileName,
          insertType
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (insertType === '') thisView.props.history.push('/contacts')
            else if (insertType === 'headOfService')
              thisView.props.history.push('/serviceheads')
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  getContactDetails = () => {
    var thisView = this
    axios
      .all([adminService.getContactDetails(this.props.match.params.contact_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData.data)
          if (resData.status) {
            let contactDetails = resData.data

            let firstName = contactDetails.firstName
            let lastName = contactDetails.lastName
            let role = contactDetails.role
            let address = contactDetails.address
            let mobile_no = contactDetails.mobileNo
            let email = contactDetails.email

            let validate = {
              firstName,
              lastName,
              role,
              address,
              mobile_no,
              email
            }
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({
              firstName,
              lastName,
              role,
              address,
              mobile_no,
              email
            })
            console.log('updated')
            thisView.setState({ contactDetails })
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

  getServiceHeadDetails = () => {
    var thisView = this
    axios
      .all([
        adminService.getServiceHeadDetails(
          this.props.match.params.serviceheads_id
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData.data)
          if (resData.status) {
            let contactDetails = resData.data

            let firstName = contactDetails.firstName
            let lastName = contactDetails.lastName
            let role = contactDetails.role
            let address = contactDetails.address
            let mobile_no = contactDetails.mobileNo
            let email = contactDetails.email

            let validate = {
              firstName,
              lastName,
              role,
              address,
              mobile_no,
              email
            }
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({
              firstName,
              lastName,
              role,
              address,
              mobile_no,
              email
            })
            console.log('updated')
            thisView.setState({ contactDetails })
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

  updateContactHeadService = fileName => {
    const { firstName, lastName, role, address, mobile_no, email } = this.state
    var thisView = this

    let insertType = ''
    let id = this.props.match.params.contact_id
    if (this.props.location.pathname.indexOf('serviceheads') > -1) {
      insertType = 'headOfService'
      id = this.props.match.params.serviceheads_id
    }

    this.setState({ authenticating: true })
    axios
      .all([
        adminService.updateContactHeadService(
          firstName,
          lastName,
          role,
          address,
          mobile_no,
          email,
          fileName,
          id,
          insertType
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (insertType === '')
              thisView.props.history.push('/contacts/' + id)
            else if (insertType === 'headOfService')
              thisView.props.history.push('/serviceheads/' + id)
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  heading = () => {
    const { serviceHead } = this.state

    if (serviceHead === true) {
      return (
        <h2 className='font-medium text-base mr-auto'>
          <Translate content='service heads form' />
        </h2>
      )
    } else {
      return (
        <h2 className='font-medium text-base mr-auto'>
          <Translate content='contact form' />
        </h2>
      )
    }
  }

  render () {
    const { authenticating } = this.state

    return (
      <div className='col-span-12 mla-contacts-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                {/* <h2 className="font-medium text-base mr-auto">
                                    Contact Form
                                </h2> */}
                {this.heading()}
              </div>
              <div className='p-5' id='vertical-form'>
                <div className='preview'>
                  <Form onSubmit={this.handleSubmit}>
                    <div>
                      <label>
                        {' '}
                        <Translate content='first name' />
                      </label>
                      <Input
                        type='text'
                        name='firstName'
                        className='input w-full border mt-2 form-control'
                        placeholder='First Name'
                        // validations={[required]}
                        onChange={this.onChange}
                        value={this.state.firstName}
                      />
                      {this.displayValidationErrors('firstName')}
                    </div>

                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='last name' />
                      </label>
                      <Input
                        type='text'
                        name='lastName'
                        className='input w-full border mt-2 form-control'
                        placeholder='Last Name'
                        // validations={[required]}
                        onChange={this.onChange}
                        value={this.state.lastName}
                      />
                      {this.displayValidationErrors('lastName')}
                    </div>
                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='role' />
                      </label>
                      <Input
                        type='text'
                        name='role'
                        className='input w-full border mt-2 form-control'
                        placeholder='Role'
                        // validations={[required]}
                        onChange={this.onChange}
                        value={this.state.role}
                      />
                      {this.displayValidationErrors('role')}
                    </div>
                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='address' />
                      </label>

                      <Input
                        type='text'
                        name='address'
                        className='input w-full border mt-2 form-control'
                        placeholder='Address'
                        //  validations={[required]}
                        onChange={this.onChange}
                        value={this.state.address}
                      />
                      {this.displayValidationErrors('address')}
                    </div>
                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='mobile no' />
                      </label>
                      <Input
                        type='tel'
                        name='mobile_no'
                        className='input w-full border mt-2 form-control'
                        placeholder='Mobile Number'
                        //  validations={[required]}
                        onChange={this.onChange}
                        value={this.state.mobile_no}
                      />
                      {this.displayValidationErrors('mobile_no')}
                    </div>
                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='email' />
                      </label>
                      <Input
                        type='email'
                        name='email'
                        className='input w-full border mt-2 form-control'
                        placeholder='email'
                        // validations={[required]}
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                      {this.displayValidationErrors('email')}
                    </div>
                    <div className='mt-3'>
                      <label>
                        {' '}
                        <Translate content='profile picture' />
                      </label>

                      {/* <Input type="file" name="file" id="mlafile"
                                                accept="image/*"
                                                value={this.state.file}
                                                className="input w-full border mt-2"
                                                // validations={[required]}
                                                className="form-file"
                                                style={{ display: "block" }}
                                                onChange={this.onChange} />
                                            {this.displayValidationErrors('file')} */}
                      <label
                        for='file-upload'
                        style={{ marginLeft: '5px' }}
                        className='custom-file-upload'
                      >
                        <i className='text-info fa fa-cloud-upload'></i>{' '}
                        <Translate content='choose file' />
                      </label>
                      <input
                        type='file'
                        id='file-upload'
                        name='file'
                        accept='image/*'
                        onChange={this.onChangeFileHandler}
                      />

                      {this.numberoffile()}

                      {this.state.newfiles &&
                        this.state.newfiles.map((files, index) => (
                          <p style={{ marginBottom: '0rem' }}>{files.name}</p>
                        ))}
                    </div>

                    {!authenticating ? (
                      <Button
                        className=' btn btn-primary mt-3'
                        color='primary'
                        type='submit'
                        disabled={this.isFormValid() ? false : true}
                      >
                        {this.state.updateContact ? (
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
export default ContactsForm
