import React from 'react'
import './usersForm.scss'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import GoogleCaptcha from '../googleCaptcha/googleCaptcha'

const required = (value, props) => {
  if (!value || (props.isCheckable && !props.checked)) {
    return <span className='form-error is-visible'>Required</span>
  }
}

class UsersForm extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      name: '',
      qualification: '',
      img: '',
      address: '',
      email: '',
      mobile_no: '',
      validateCaptcha: false,
      captchaError: false,
      authenticating: false
      // facebook: "",
      // instagram: "",
      // twitter: "",
      // linkin: ""
    }
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleClick () {
    this.form.validateAll()
  }

  onCaptchaChange = value => {
    if (!value) {
      this.setState({ validateCaptcha: false })
      this.setState({ captchaError: true })
    } else {
      this.setState({ validateCaptcha: true })
      this.setState({ captchaError: false })
    }
  }
  handleSubmit (event) {
    event.preventDefault()
    if (!this.state.validateCaptcha) {
      this.setState({ captchaError: true })
      return
    }
    this.setState({ authenticating: false })

    console.log(event)
    console.log(this.state)
  }
  render () {
    const { authenticating, captchaError } = this.state

    return (
      <div className='col-span-12 mla-contacts-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-11'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>Add User</h2>
              </div>
              <div className='p-4' id='vertical-form'>
                <div className='preview'>
                  <Form
                    ref={c => {
                      this.form = c
                    }}
                    onSubmit={this.handleSubmit}
                  >
                    <div className='intro-y box'>
                      <div className='p-5' id='vertical-form'>
                        <div className='preview'>
                          <div>
                            <label>Name</label>
                            <Input
                              type='text'
                              name='name'
                              placeholder='Enter Name'
                              validations={[required]}
                              className={
                                this.state.name === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            />
                          </div>
                          <div className='mt-3'>
                            <label>Qualification</label>
                            <Input
                              type='text'
                              name='qualification'
                              placeholder='Qualification'
                              validations={[required]}
                              className={
                                this.state.qualification === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            />
                          </div>
                          <div className='mt-3'>
                            <label>Text</label>
                            <textarea
                              type='text'
                              rows='5'
                              name='address'
                              placeholder='Address'
                              validations={[required]}
                              className={
                                this.state.address === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            ></textarea>
                          </div>
                          <div className='mt-3'>
                            <label>Email</label>
                            <Input
                              type='email'
                              name='email'
                              placeholder='Email'
                              validations={[required]}
                              className={
                                this.state.email === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            />
                          </div>
                          <div className='mt-3'>
                            <label>Contact No</label>
                            <Input
                              type='tel'
                              name='mobile_no'
                              placeholder='Mobile Number'
                              validations={[required]}
                              className={
                                this.state.mobile_no === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            />
                          </div>
                          <div className='mt-3'>
                            <label>Profile Picture</label>
                            <Input
                              type='file'
                              name='file'
                              validations={[required]}
                              className={
                                this.state.file === ''
                                  ? 'form-control error'
                                  : 'form-control input w-full border mt-2'
                              }
                              onChange={this.onChange}
                            />
                          </div>
                          <br></br>
                          <GoogleCaptcha
                            className='captcha'
                            onChange={this.onCaptchaChange}
                          />

                          {captchaError && (
                            <span className='form-error'>
                              * Please verify that you are not a robot. <br />
                            </span>
                          )}
                          {!authenticating ? (
                            <button
                              onClick={this.handleClick}
                              className='button bg-theme-1 text-white button'
                            >
                              Add User
                            </button>
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
export default UsersForm
