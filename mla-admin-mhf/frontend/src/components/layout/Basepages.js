import React from 'react'

class Basepages extends React.Component {
  render () {
    return (
      <div className={'wrapper'}>
        <div className='container-fluid'>
          <div className='row'>{this.props.children}</div>
        </div>
      </div>
    )
  }
}

export default Basepages
