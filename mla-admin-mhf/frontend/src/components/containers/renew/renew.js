import React from 'react'
import './renew.scss'
// import Form from 'react-validation/build/form'
// import Input from 'react-validation/build/input'
import axios from 'axios'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'
import {
  Row,
  Col,
  Label,
  FormGroup,
  Nav,
  NavItem,
  Modal,
  ModalBody,
  Alert,
  Button
} from 'reactstrap'
import classnames from 'classnames'
import { VscClose } from 'react-icons/vsc'

class Renew extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authenticating: false,
      updateContact: false,
      planType: [
        {
          label: 'Six Month Plan',
          value: 'Six Month Plan',
          planTypeName: 'Six Month Plan',
          planTypeId: '1'
        },
        {
          label: 'One Year Plan',
          value: 'One Year Plan',
          planTypeName: 'One Year Plan',
          planTypeId: '2'
        }
      ],
      selectedPlan: {},
      planTypeId: '',
      activePlan: '',
      paymentOption: false,
      formDetails: true,
      selectedPayment: 'Online Payment',
      paymentFiles: [],
      toggleModal: false
    }
    this.validators = validators
  }
  componentDidMount () {}

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

  isFormValidContactInfo = () => {
    let status = true
    Object.keys(this.validators).forEach(field => {
      if (
        field === 'mobile_no' ||
        field === 'address' ||
        field === 'area' ||
        field === 'city' ||
        field === 'state' ||
        field === 'zipCode'
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

  handleSubmit = event => {
    event.preventDefault()
    this.setState({ authenticating: true })
    this.fileUpload()
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
            if (eachResponse.filename) {
              // filesReferencesList.push(eachResponse.filename);
              filesReferencesList = eachResponse.filename
            }
            return true
          })
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
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(e)
  }

  toggleMemberPlan = (tab, selectedPlan) => {
    if (this.state.activePlan !== tab)
      this.setState({
        activePlan: tab,
        planTypeId: selectedPlan.planTypeId,
        selectedPlan
      })
    // this.onNext()
  }

  handleChangePayment = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(e)
  }
  onChangeFileHandlerPayment = e => {
    this.setState({
      [e.target.name]: e.target.files
    })
    let thisView = this
    let file1 = Array.from(e.target.files)
    thisView.setState({ paymentFiles: file1 })
  }
  paymentFiles = () => {
    const { paymentFiles } = this.state
    if (paymentFiles.length === 0) {
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
        file({paymentFiles.length})
      </p>
    )
  }
  submitDetails = () => {
    this.setState({ paymentOption: true, formDetails: false })
  }
  addMembership = () => {
    // this.props.history.push('/membership')
    this.toggleSubmitModal()
  }
  toggleSubmitModal = () => {
    this.setState({
      toggleModal: !this.state.toggleModal
    })
  }
  render () {
    const {
      paymentOption,
      formDetails,
      selectedPayment,
      transaction,
      toggleModal,
      selectedPlan,
      planType
    } = this.state

    return (
      <div className='col-span-12 renew-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  Membership Form
                </h2>
              </div>
              <div className='p-5' id='vertical-form'>
                {formDetails && (
                  <div className='full-width'>
                    <div className='third-info'>
                      <Label className='label-name section-heading'>
                        Membership Plans
                      </Label>
                      <Row>
                        <Col md={12}>
                          <div className='membership-plan-section'>
                            <Nav tabs className=' '>
                              <Row>
                                {planType &&
                                  planType.length > 0 &&
                                  planType.map(eachPlan => {
                                    return (
                                      <Col md={5}>
                                        <NavItem>
                                          <span
                                            className={classnames({
                                              active:
                                                this.state.activePlan ===
                                                eachPlan.planTypeName
                                            })}
                                            onClick={() => {
                                              this.toggleMemberPlan(
                                                eachPlan.planTypeName,
                                                eachPlan
                                              )
                                            }}
                                          >
                                            <p className='plan-heading-text'>
                                              {' '}
                                              {eachPlan.planTypeName}
                                            </p>
                                            <p className='plan-small-text'>
                                              {' '}
                                              {eachPlan.planTypeName}
                                            </p>
                                          </span>
                                        </NavItem>
                                      </Col>
                                    )
                                  })}
                              </Row>
                            </Nav>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className='btn-div'>
                      {selectedPlan && selectedPlan.planTypeName ? (
                        <Button
                          type='submit'
                          className='next-btn'
                          onClick={this.submitDetails}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button type='submit' className='next-btn' disabled>
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                {paymentOption && (
                  <div className='full-width'>
                    <h3 className='inner-heading'> Payment</h3>

                    <div className='third-info'>
                      <Row>
                        <Col md={6}>
                          <div className='filter-sortby'>
                            <div className='sortby-section'>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type='radio'
                                    name='selectedPayment'
                                    value='Online Payment'
                                    checked={
                                      selectedPayment === 'Online Payment'
                                    }
                                    onChange={this.handleChangePayment}
                                  />
                                  Online Payment
                                </Label>
                                {selectedPayment === 'Online Payment' && (
                                  <>
                                    <FormGroup>
                                      <input
                                        type='text'
                                        name={'transaction'}
                                        className='input w-full border mt-2 form-control'
                                        value={transaction}
                                        onChange={this.handleChangePayment}
                                        placeholder='Transaction ID'
                                      />
                                    </FormGroup>
                                    <FormGroup>
                                      <label
                                        for='file-upload-payment'
                                        style={{ marginLeft: '5px' }}
                                        className='custom-file-upload-screen mt-2'
                                      >
                                        <i className='text-info fa fa-cloud-upload'></i>{' '}
                                        Upload Screen Shoot
                                      </label>
                                      <input
                                        type='file'
                                        id='file-upload-payment'
                                        name='file'
                                        accept='image/*'
                                        onChange={
                                          this.onChangeFileHandlerPayment
                                        }
                                      />
                                      {this.paymentFiles()}
                                      {this.state.paymentFiles &&
                                        this.state.paymentFiles.map(
                                          (files, index) => (
                                            <p style={{ marginBottom: '0rem' }}>
                                              {files.name}
                                            </p>
                                          )
                                        )}
                                    </FormGroup>
                                  </>
                                )}
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type='radio'
                                    name='selectedPayment'
                                    value='Wallet Payment'
                                    checked={
                                      selectedPayment === 'Wallet Payment'
                                    }
                                    onChange={this.handleChangePayment}
                                  />
                                  Wallet Payment
                                </Label>
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type='radio'
                                    name='selectedPayment'
                                    value='COD Delivery'
                                    checked={selectedPayment === 'COD Delivery'}
                                    onChange={this.handleChangePayment}
                                  />
                                  COD Delivery
                                </Label>
                              </FormGroup>
                              <FormGroup>
                                <Label check>
                                  <input
                                    type='radio'
                                    name='selectedPayment'
                                    value='Free Camp'
                                    checked={selectedPayment === 'Free Camp'}
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
                    <div className='btn-div'>
                      <Button
                        type='submit'
                        className='next-btn'
                        onClick={this.addMembership}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
                <Modal isOpen={toggleModal} className='add-modal'>
                  <ModalBody style={{ backgroundColor: '#fff' }}>
                    <div className=''>
                      <div className='col-span-12'>
                        <Row className='lg-close'>
                          <VscClose
                            className='close-icon'
                            onClick={this.toggleSubmitModal}
                          />
                        </Row>
                        {/* <div className=''>
                  <p className='heading-text'> Success</p>
                </div> */}

                        <Alert color='success' className='mt-3'>
                          Application submitted Successfully you will get SMS
                          and notification once your request approved
                        </Alert>
                        <Alert color='success'>
                          Once your request approved you will able to download
                          you MHF card from Home Page
                        </Alert>

                        <Row className=''>
                          <Col className='add-button text-right'>
                            <Button
                              className='close-button'
                              color='primary'
                              onClick={this.toggleSubmitModal}
                            >
                              <span className='text-white'> Close </span>
                            </Button>{' '}
                            {''}{' '}
                          </Col>
                        </Row>
                      </div>
                    </div>{' '}
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Renew
