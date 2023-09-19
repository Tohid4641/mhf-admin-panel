import React from 'react'
import './mlaprofileForm.scss'
import Form from 'react-validation/build/form'
import { Button } from 'reactstrap'
import Input from 'react-validation/build/input'
import axios from 'axios'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'
import { connect } from 'react-redux'

import Translate from 'react-translate-component'

// const required = (value, props) => {
//     if (!value || (props.isCheckable && !props.checked)) {
//         return <span className="form-error is-visible">Required</span>;
//     }
// };

class MlaProfileForm extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleClick = this.handleClick.bind(this);
    this.state = {
      id: '',
      profile_name: '',
      qualification: 'mhf',
      // role: '',
      address: '',
      mobile_no: '9876543210',
      facebook_link: '',
      twitter_link: '',
      file: '',
      newfiles: [],
      authenticating: false,
      profileUpdate: false,
      profileDetails: {}
    }
    this.validators = validators
  }

  componentDidMount () {
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ profileUpdate: true })
      this.getProfile()
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
      // if (field === 'profile_name' || field === 'qualification' || field === 'address' || field === 'mobile_no') {
      if (field === 'profile_name' || field === 'address') {
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

    if (this.state.file && this.state.file !== '') {
      this.fileUpload()
    } else if (
      this.state.profileDetails &&
      this.state.profileDetails.mlaPhoto
    ) {
      this.updateProfile(this.state.profileDetails.mlaPhoto)
    }
  }

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
            if (eachResponse.filename)
              filesReferencesList = eachResponse.filename
            return true
          })

          thisView.updateProfile(filesReferencesList)
          thisView.setState({ authenticating: false })
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  files3Upload () {
    const { file } = this.state

    let files = []
    if (file && file.length > 0) {
      Object.keys(file).map((key, index) => {
        files.push(file[key])
        return true
      })
    }

    var thisView = this
    thisView.setState({ authenticating: true })

    axios
      .all(files.map(eachFile => adminService.s3Upload(eachFile)))
      .then(function (res) {
        if (res) {
          let filesReferencesList = []
          res.map(eachResp => {
            let resData = eachResp.data
            if (resData.fileName) {
              filesReferencesList.push(resData.fileName)
            }
            return true
          })

          filesReferencesList = filesReferencesList.join('||||')

          thisView.updateProfile(filesReferencesList)
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  updateProfile = fileName => {
    const {
      profile_name,
      qualification,
      address,
      mobile_no,
      facebook_link,
      twitter_link
    } = this.state

    let links = JSON.stringify({
      facebook_link: facebook_link,
      twitter_link: twitter_link
    })
    var thisView = this
    this.setState({ authenticating: true })

    axios
      .all([
        adminService.updateProfile(
          profile_name,
          qualification,
          address,
          mobile_no,
          links,
          fileName
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            // thisView.props.history.push("/mlaprofile");
            thisView.props.history.push('/profile')
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

  getProfile = () => {
    var thisView = this
    axios
      .all([adminService.getProfile()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let profileDetails = resData.data

            let profile_name = profileDetails.fullName
            let qualification = profileDetails.qualification
            let address = profileDetails.aboutMLA
            let mobile_no = profileDetails.mobileNo
            let fileName = profileDetails.mlaPhoto

            let validate = { profile_name, qualification, address, mobile_no }
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({
              profile_name,
              qualification,
              address,
              mobile_no,
              fileName
            })
            console.log('updated')
            thisView.setState({ profileDetails })
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
    console.log()
    const { authenticating, profileDetails } = this.state
    const { config } = this.props

    return (
      <div className='col-span-12 mla-profile-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-11'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  <Translate content='profile' />
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
                              <Translate content='name' />
                            </label>
                            <Input
                              type='text'
                              name='profile_name'
                              className='input w-full border mt-2 form-control'
                              placeholder='Enter Name'
                              // validations={[required]}
                              value={this.state.profile_name}
                              onChange={this.onChange}
                            />
                            {this.displayValidationErrors('profile_name')}
                          </div>
                          {/* <div className="mt-3">
                                                        <label><Translate content="qualification" /></label>
                                                        <Input type="text" name="qualification" className="input w-full border mt-2 form-control" placeholder="Qualification"
                                                            // validations={[required]}
                                                            onChange={this.onChange}
                                                            value={this.state.qualification} />
                                                        {this.displayValidationErrors('qualification')}
                                                    </div> */}

                          <div className='mt-3'>
                            <label>
                              <Translate content='about' />
                            </label>
                            <textarea
                              type='text'
                              rows='05'
                              name='address'
                              className='input w-full border mt-2 form-control'
                              placeholder='About'
                              // validations={[required]}
                              value={this.state.address}
                              onChange={this.onChange}
                            ></textarea>
                            {this.displayValidationErrors('address')}
                          </div>
                          {/* <div className="mt-3">
                                                        <label> <Translate content="contact no" /> </label>
                                                        <Input type="tel" name="mobile_no" className="input w-full border mt-2 form-control" placeholder="Mobile Number"
                                                            // validations={[required]}
                                                            onChange={this.onChange}
                                                            value={this.state.mobile_no} />
                                                        {this.displayValidationErrors('mobile_no')}
                                                    </div> */}

                          {/*   
                                                <Row>
                                                    <Col md sm ={6}>                                            
                                                            <div className="mt-3">
                                                        <label><Translate content="facebook link" /></label>
                                                        <Input type="tel" name="facebook_link" className="input w-full border mt-2 form-control" placeholder="Facebook Link"
                                                            // validations={[required]}
                                                            onChange={this.onChange}
                                                            value={this.state.facebook_link} />
                                                        {this.displayValidationErrors('facebook_link')}
                                                    </div>
                                                    </Col>

                                                    <Col md sm ={6}>                                                
                                                        <div className="mt-3">
                                                        <label><Translate content="twitter link" /></label>
                                                        <Input type="tel" name="twitter_link" className="input w-full border mt-2 form-control" placeholder="Twitter Link"
                                                            // validations={[required]}
                                                            onChange={this.onChange}
                                                            value={this.state.twitter_link} />
                                                        {this.displayValidationErrors('twitter_link')}
                                                    </div>
                                                    </Col>


                                                    </Row> */}

                          <div className='mt-3'>
                            <label>
                              {' '}
                              <Translate content='profile picture' />{' '}
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
                                <p style={{ marginBottom: '0rem' }}>
                                  {files.name}
                                </p>
                              ))}
                          </div>

                          {profileDetails.mlaPhoto && (
                            <div className='mla-profile-pic'>
                              <img
                                src={
                                  config.fileBasicPath + profileDetails.mlaPhoto
                                }
                                alt='profile'
                              />
                            </div>
                          )}

                          <br></br>

                          {/* {
                                                        !authenticating ?

                                                            <button className="button" type="submit"
                                                                className="button bg-theme-1 text-white">Add Profile</button> :
                                                            <i className="fa fa-spin fa-refresh authentication-loading" />
                                                    } */}

                          <hr />
                          <br></br>

                          {/* <div className=" flex-col sm:flex-row items-center ">
                                                        <h2 className="text-center font-medium text-base mr-auto">
                                                        <Translate content="tamil" />
                                                    </h2>

                                                    </div>
                                                    <br></br>

                                                    <Row style={{ marginTop: "13px" }}>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <Input type="text" name="profile_name" className="input w-full border mt-2 form-control" placeholder="Enter Name"
                                                                    // validations={[required]}
                                                                    value={this.state.profile_name}
                                                                    onChange={this.onChange} />
                                                                {this.displayValidationErrors('profile_name')}

                                                            </FormGroup>
                                                        </Col>

                                                    </Row>


                                                    <Row>


                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Input type="text" name="qualification" className="input w-full border mt-2 form-control" placeholder="Qualification"
                                                                    // validations={[required]}
                                                                    onChange={this.onChange}
                                                                    value={this.state.qualification} />
                                                                {this.displayValidationErrors('qualification')}

                                                            </FormGroup>
                                                        </Col>
                                                    </Row>


                                                    <Row>

                                                        <Col>
                                                            <FormGroup>
                                                                <textarea type="text" rows="05" name="address" className="input w-full border mt-2 form-control" placeholder="Address"
                                                                    // validations={[required]}
                                                                    value={this.state.address}
                                                                    onChange={this.onChange}></textarea>
                                                                {this.displayValidationErrors('address')}
                                                            </FormGroup>
                                                        </Col>

                                                    </Row> */}

                          {!authenticating ? (
                            <Button
                              className=' btn btn-primary mt-3'
                              color='primary'
                              type='submit'
                              disabled={this.isFormValid() ? false : true}
                            >
                              {this.state.profileUpdate ? (
                                <span className='text-white'>
                                  <Translate content='update' />
                                </span>
                              ) : (
                                <span className='text-white'>
                                  <Translate content='publish' />
                                </span>
                              )}{' '}
                            </Button>
                          ) : (
                            <i className='fa fa-spin fa-refresh authentication-loading' />
                          )}
                        </div>
                        <div className='source-code hidden'>
                          <button
                            data-target='#copy-vertical-form'
                            className='copy-code button button--sm border flex items-center text-gray-700'
                          >
                            {' '}
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              className='feather feather-file w-4 h-4 mr-2'
                            >
                              <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
                              <polyline points='13 2 13 9 20 9'></polyline>
                            </svg>{' '}
                            Copy code{' '}
                          </button>
                          <div className='overflow-y-auto h-64 mt-3'>
                            <pre
                              className='source-preview'
                              id='copy-vertical-form'
                            >
                              {' '}
                              <code className='text-xs p-0 rounded-md html pl-5 pt-8 pb-4 -mb-10 -mt-10 hljs xml'>
                                {' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>div</span>&gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>label</span>
                                  &gt;
                                </span>
                                Email
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>label</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>input</span>{' '}
                                  <span className='hljs-attr'>type</span>=
                                  <span className='hljs-string'>"email"</span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "input w-full border mt-2"
                                  </span>{' '}
                                  <span className='hljs-attr'>placeholder</span>
                                  =
                                  <span className='hljs-string'>
                                    "example@gmail.com"
                                  </span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>div</span>
                                  &gt;
                                </span>
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>div</span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>"mt-3"</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>label</span>
                                  &gt;
                                </span>
                                Password
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>label</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>input</span>{' '}
                                  <span className='hljs-attr'>type</span>=
                                  <span className='hljs-string'>
                                    "password"
                                  </span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "input w-full border mt-2"
                                  </span>{' '}
                                  <span className='hljs-attr'>placeholder</span>
                                  =<span className='hljs-string'>"secret"</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>div</span>
                                  &gt;
                                </span>
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>div</span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "flex items-center text-gray-700 mt-5"
                                  </span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>input</span>{' '}
                                  <span className='hljs-attr'>type</span>=
                                  <span className='hljs-string'>
                                    "checkbox"
                                  </span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "input border mr-2"
                                  </span>{' '}
                                  <span className='hljs-attr'>id</span>=
                                  <span className='hljs-string'>
                                    "vertical-remember-me"
                                  </span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>label</span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "cursor-pointer select-none"
                                  </span>{' '}
                                  <span className='hljs-attr'>for</span>=
                                  <span className='hljs-string'>
                                    "vertical-remember-me"
                                  </span>
                                  &gt;
                                </span>
                                Remember me
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>label</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>div</span>
                                  &gt;
                                </span>{' '}
                                <span className='hljs-tag'>
                                  &lt;<span className='hljs-name'>button</span>{' '}
                                  <span className='hljs-attr'>type</span>=
                                  <span className='hljs-string'>"button"</span>{' '}
                                  <span className='hljs-attr'>class</span>=
                                  <span className='hljs-string'>
                                    "button bg-theme-1 text-white mt-5"
                                  </span>
                                  &gt;
                                </span>
                                Login
                                <span className='hljs-tag'>
                                  &lt;/<span className='hljs-name'>button</span>
                                  &gt;
                                </span>
                              </code>
                              <textarea
                                style={{ marginLeft: '1000000px' }}
                                className='fixed w-1 h-1'
                              ></textarea>
                            </pre>
                          </div>
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

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MlaProfileForm)
