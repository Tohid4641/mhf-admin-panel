import React from 'react'
import { Row, Col } from 'reactstrap'

class Footer extends React.Component {
  render () {
    return (
      //<!--================================= footer -->

      <footer className='bg-white p-4 footer-main'>
        <Row>
          <Col md={6}>
            <div className='text-center text-md-left'>
              <p className='mb-0'>
                {' '}
                © Copyright <span id='copyright'> 2020</span>.{' '}
                <a href='_blank'> DEzen </a> All Rights Reserved.{' '}
              </p>
            </div>
          </Col>
          <Col md={6}>
            <ul className='text-center text-md-right'>
              <li className='list-inline-item'>
                <a href='_blank'>Terms &amp; Conditions </a>{' '}
              </li>
            </ul>
          </Col>
        </Row>
      </footer>
    )
  }
}
export default Footer
