import React from 'react'
import './joinUs.scss'

class JoinUs extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }
  componentDidMount () {}

  render () {
    return (
      <div className='col-span-12 joinUs'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              Join Us or Donate
            </h2>
          </div>
        </div>
      </div>
    )
  }
}
export default JoinUs
