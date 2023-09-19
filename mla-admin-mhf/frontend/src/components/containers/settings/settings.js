import React from 'react'
import './settings.scss'
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'

class Settings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      modal: false
    }
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

  isFormValid = () => {
    let status = true
    Object.keys(this.validators).forEach(field => {
      if (field === 'departmentName' || field === 'mobile_no') {
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

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    return (
      <div className='col-span-12 mla-settings'>
        <Modal className='u-modal' isOpen={this.state.modal}>
          <Form onSubmit={this.Submit}>
            {/* <ModalHeader style={{ border: "none" }} toggle={this.toggle1}> </ModalHeader> */}

            <ModalHeader toggle={this.toggle}></ModalHeader>
            <ModalBody>
              <Row className='container ml-1'>
                <Col md={12}>
                  <FormGroup>
                    {/* <Label className="mt-2">Name</Label> */}
                    <Input
                      className='mt-1'
                      onChange={this.onChange}
                      value={this.state.companyname}
                      type='text'
                      placeholder=' Name'
                      name='name'
                    />
                    {/* {this.displayValidationErrors('companyname')} */}
                  </FormGroup>

                  <FormGroup>
                    {/* <Label className="mt-2">Email</Label> */}

                    <Input
                      type='text'
                      onChange={this.onChange}
                      value={this.state.mobile_no}
                      placeholder='Email'
                      name='mobile_no'
                    />
                    {/* {this.displayValidationErrors('mobile_no')} */}
                  </FormGroup>
                </Col>
              </Row>
              <div className='text-center'>
                {!this.state.authenticating ? (
                  <Button
                    color='primary'
                    className='update'
                    // disabled={this.isFormValid() ? false : true}
                  >
                    <span className=''> Submit</span>
                  </Button>
                ) : (
                  <i className='fa fa-spin fa-refresh authentication-loading' />
                )}
              </div>
            </ModalBody>
          </Form>
          <br></br>
        </Modal>

        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='intro-y font-medium text-xl sm:text-2xl text-gray'>
              {/* <Translate content="contactUs" /> */}
              Mobile & API Settings Manage API Access Keys
            </h2>
            <p
              className='ml-auto flex'
              onClick={() => {
                this.toggle()
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* <Translate content="update" /> */} Add{' '}
            </p>
          </div>
        </div>
        <Row>
          <Col sm md lg={10} className='mb-30'>
            <Card>
              <div className='p-5'>
                <h2 className='intro-y font-medium text-xl sm:text-2xl'>
                  {' '}
                  Manage API Access Keys{' '}
                </h2>
                <p className='mt-4 font-large'>
                  Use these keys to setup your application(s).
                </p>
                <p className='text-info mt-4 font-large'>PlayTube API Docs</p>
              </div>
              <hr></hr>

              <div className='p-5'>
                <p className='grey'>Site Server Key</p>
                <p className='token'>86eOdOa78d291aodcfbb76104h3883jj32jj</p>
                <hr className='mt-1'></hr>

                <Button type='submit' className='reset-b mt-5'>
                  RESET KEYS
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Settings
