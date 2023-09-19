import React from 'react'
import './gallery.scss'

class Gallery extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className='col-span-12 mla-contcts'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10'>
            <h2 className='text-lg text-black font-medium'>Gallery</h2>
          </div>
        </div>
      </div>
    )
  }
}
export default Gallery
