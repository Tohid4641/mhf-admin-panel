import React from 'react'
import './eventsForm.scss'

class EventsForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className='col-span-12 mla-contacts-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='intro-y col-span-12 lg:col-span-10'>
            <div className='intro-y box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>Events Form</h2>
              </div>
              <div className='p-5' id='vertical-form'>
                <div className='preview'>
                  <div>
                    <label>Name</label>
                    <input
                      type='text'
                      className='input w-full border mt-2'
                      placeholder='Enter Name'
                    />
                  </div>
                  <div className='mt-3'>
                    <label>Role</label>
                    <input
                      type='text'
                      className='input w-full border mt-2'
                      placeholder='role'
                    />
                  </div>
                  <div className='mt-3'>
                    <label>Place</label>

                    <input
                      type='text'
                      className='input w-full border mt-2'
                      placeholder='Address'
                    />
                  </div>
                  <div className='mt-3'>
                    <label>Mobile No</label>
                    <input
                      type='tel'
                      className='input w-full border mt-2'
                      placeholder='Mobile Number'
                    />
                  </div>
                  <div className='mt-3'>
                    <label>Email</label>
                    <input
                      type='email'
                      className='input w-full border mt-2'
                      placeholder='email'
                    />
                  </div>
                  <div className='mt-3'>
                    <label>Profile Picture</label>
                    <input
                      type='file'
                      className='input w-full border mt-2'
                      placeholder='role'
                    />
                  </div>

                  <button
                    type='button'
                    className='button bg-theme-1 text-white mt-5'
                  >
                    Add Contact
                  </button>
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
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='feather feather-file w-4 h-4 mr-2'
                    >
                      <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
                      <polyline points='13 2 13 9 20 9'></polyline>
                    </svg>{' '}
                    Copy code{' '}
                  </button>
                  <div className='overflow-y-auto h-64 mt-3'>
                    <pre className='source-preview' id='copy-vertical-form'>
                      {' '}
                      <code className='text-xs p-0 rounded-md html pl-5 pt-8 pb-4 -mb-10 -mt-10 hljs xml'>
                        {' '}
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>div</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>label</span>&gt;
                        </span>
                        Email
                        <span className='hljs-tag'>
                          &lt;/<span className='hljs-name'>label</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>input</span>{' '}
                          <span className='hljs-attr'>type</span>=
                          <span className='hljs-string'>"email"</span>{' '}
                          <span className='hljs-attr'>class</span>=
                          <span className='hljs-string'>
                            "input w-full border mt-2"
                          </span>{' '}
                          <span className='hljs-attr'>placeholder</span>=
                          <span className='hljs-string'>
                            "example@gmail.com"
                          </span>
                          &gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;/<span className='hljs-name'>div</span>&gt;
                        </span>
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>div</span>{' '}
                          <span className='hljs-attr'>class</span>=
                          <span className='hljs-string'>"mt-3"</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>label</span>&gt;
                        </span>
                        Password
                        <span className='hljs-tag'>
                          &lt;/<span className='hljs-name'>label</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;<span className='hljs-name'>input</span>{' '}
                          <span className='hljs-attr'>type</span>=
                          <span className='hljs-string'>"password"</span>{' '}
                          <span className='hljs-attr'>class</span>=
                          <span className='hljs-string'>
                            "input w-full border mt-2"
                          </span>{' '}
                          <span className='hljs-attr'>placeholder</span>=
                          <span className='hljs-string'>"secret"</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;/<span className='hljs-name'>div</span>&gt;
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
                          <span className='hljs-string'>"checkbox"</span>{' '}
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
                          &lt;/<span className='hljs-name'>label</span>&gt;
                        </span>{' '}
                        <span className='hljs-tag'>
                          &lt;/<span className='hljs-name'>div</span>&gt;
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
                          &lt;/<span className='hljs-name'>button</span>&gt;
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
          </div>
        </div>
      </div>
    )
  }
}
export default EventsForm
