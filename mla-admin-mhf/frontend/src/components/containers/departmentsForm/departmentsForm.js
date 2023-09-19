import React from 'react'
import { Card, CardBody, Row, Col, FormGroup, Button, Label } from 'reactstrap'
import axios from 'axios'
import Input from 'react-validation/build/input'
import Form from 'react-validation/build/form'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'

import Translate from 'react-translate-component'

import './departmentsForm.scss'

class departmentsForm extends React.Component {
  constructor (props) {
    super(props)

    this.tabround = this.tabround.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      departmentName: '',
      data: '',
      apiError: '',
      authenticating: false,
      updateDepartment: false,
      departmentDetails: {},
      departmentname: ''
    }
    this.validators = validators
  }

  tabround (tab) {
    if (this.state.tabround !== tab) {
      this.setState({
        tabround: tab
      })
    }
  }

  componentDidMount () {
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ updateDepartment: true })
      this.getDepartment(this.props.match.params.department_id)
      // console.log(this.props.match.params.department_id);
    }
  }

  /*******************************Function New Validation Start************************************************ */

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
      if (field === 'departmentName') {
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
    event.preventDefault()

    // this.setState({ authenticating: true });
    // this.updateDepartment();
    var thisView = this

    if (thisView.state.updateDepartment) thisView.updateDepartment()
    else thisView.insertDepartment()
  }

  insertDepartment = () => {
    this.setState({ authenticating: true })

    const { departmentName } = this.state
    var thisView = this

    axios
      .all([adminService.insertDepartment(departmentName)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.props.history.push('/departments')
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

  getDepartment = () => {
    var thisView = this
    axios
      .all([adminService.getDepartment(this.props.match.params.department_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          console.log(resData)
          if (resData.status) {
            let departmentDetails = resData.data

            let departmentName = departmentDetails.departmentName

            let validate = { departmentName }
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({ departmentName })
            console.log('updated')
            thisView.setState({ departmentDetails })
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

  updateDepartment = () => {
    const { departmentName } = this.state
    var thisView = this
    let id = this.props.match.params.department_id
    this.setState({ authenticating: true })
    axios
      .all([adminService.updateDepartment(departmentName, id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            // thisView.props.history.push("/mlaprofile");
            thisView.props.history.push('/departments')
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in Departments')
      })
  }

  render () {
    console.log(this.state.departmentDetails)
    const { authenticating } = this.state

    return (
      <div className='col-span-12 mla-departments-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-6'>
            <div className='intro-y'>
              <div className='flex flex-col sm:flex-row items-center p-4 border-b border-gray-200'>
                <h1 className='font-medium text-base mr-auto'>
                  <Translate content='departments form' />
                </h1>
              </div>
              <Row>
                <Col md={12}>
                  <Card className=' card-statistics'>
                    <CardBody>
                      <Form onSubmit={this.handleSubmit}>
                        <FormGroup className='section-field'>
                          <Label>
                            {' '}
                            <Translate content='department name' />{' '}
                          </Label>
                          <Input
                            placeholder='Department Name'
                            type='text'
                            name='departmentName'
                            value={this.state.departmentDetails.departmentName}
                            onChange={this.onChange}
                            className='form-control'
                          />
                          {this.displayValidationErrors('departmentName')}
                        </FormGroup>

                        <FormGroup>
                          {/* {
                                                !authenticating ?
                                                    <Button className=" btn btn-primary mt-3" color="primary" type="submit"><span className="text-white">Submit</span>
                                                    </Button>:
                                                <i className="fa fa-spin fa-refresh authentication-loading" />
                                            } */}
                          {!authenticating ? (
                            <Button
                              className=' btn btn-primary mt-3'
                              color='primary'
                              type='submit'
                              disabled={this.isFormValid() ? false : true}
                            >
                              {this.state.updateDepartment ? (
                                <span className='text-white'>
                                  {' '}
                                  <Translate content='update' />{' '}
                                </span>
                              ) : (
                                <span className='text-white'>
                                  {' '}
                                  <Translate content='submit' />{' '}
                                </span>
                              )}
                            </Button>
                          ) : (
                            <i className='fa fa-spin fa-refresh authentication-loading' />
                          )}
                        </FormGroup>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default departmentsForm
