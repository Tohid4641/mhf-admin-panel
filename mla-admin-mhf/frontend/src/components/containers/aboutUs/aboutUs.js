import React from 'react'
import './aboutUs.scss'
import { Row, Col, Card, CardBody } from 'reactstrap'
import Logo from '../../images/main/logoc4.png'

class AboutUs extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }
  componentDidMount () {}

  render () {
    return (
      <div className='col-span-12 aboutUs'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10 mb-10'>
            <h2 className='text-lg text-black font-medium'>
              About us & Contact
            </h2>
          </div>
        </div>
        <Row>
          <Col sm md lg={12} className='mb-30'>
            <Card className='card-statistics h-100'>
              <CardBody>
                <div className=' px-5 '>
                  {/* <div className="intro-y box px-5 "> */}
                  <div className='logo-img-section'>
                    <img src={Logo} alt='Logo' className='logo-image mx-auto' />
                  </div>
                  <div class='intro-y news p-5 box mt-8'>
                    <Row>
                      <Col md={12}>
                        <h2 className='heading-text'>
                          Mujtaba Helping Foundation
                        </h2>
                      </Col>
                      <Col md={1}>
                        <div className='icon-seciton'>
                          <i
                            class='fa
                             fa-map-marker'
                          ></i>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div className='text-section'>
                          <h2>
                            #6-31240/219/4, 3rd Floor, M.S Maqtha,Raj Bhavan,
                            Samujiguda, Hyderabad, India - 500082
                          </h2>
                        </div>
                      </Col>
                      <Col md={1}>
                        <div className='icon-seciton'>
                          <i class='fa fa-envelope'></i>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div className='text-section'>
                          <h2>mujtabahelpingfoundation@gmail.com</h2>
                        </div>
                      </Col>
                      <Col md={1}>
                        <div className='icon-seciton'>
                          <i class='fa fa-globe'></i>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div className='text-section'>
                          <h2>
                            <a href='https://mhfglobal.com/mhf/'>
                              www.mhfglobal.com
                            </a>
                          </h2>
                        </div>
                      </Col>
                      <Col md={1}>
                        <div className='icon-seciton'>
                          <i class='fa fa-phone ' aria-hidden='true'></i>{' '}
                        </div>
                      </Col>
                      <Col md={11}>
                        <div className='text-section'>
                          <h2>+91 8886210001</h2>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default AboutUs
