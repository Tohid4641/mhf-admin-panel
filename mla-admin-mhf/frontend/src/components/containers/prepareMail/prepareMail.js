import React from 'react'
import './prepareMail.scss'
import {
  Row,
  Col,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label
} from 'reactstrap'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react'
import { Multiselect } from 'multiselect-react-dropdown'
import adminService from '../../services/adminService'

class PrepareMail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profileDetails: [],
      options: []
    }
  }
  componentDidMount () {
    this.setState({
      event_title: this.props.subject,
      description: this.props.content
    })
    this.getMailID()
  }

  getMailID = () => {
    var thisView = this
    axios
      .all([adminService.getContactList()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            if (resData.data) {
              let options = resData.data.map(mail => {
                return {
                  name: mail.email + '   ' + mail.role,
                  id: mail._id
                }
              })

              thisView.setState({ options })
            }
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

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSelect = (selectedList, selectedItem) => {}

  onRemove = (selectedList, removedItem) => {}

  closeModal = e => {
    e.preventDefault()
    this.props.closeModal()
  }

  formSubmit = e => {
    e.preventDefault()
    this.props.closeModal()
  }

  render () {
    const { title } = this.props
    const { options, selectedValue, event_title, description } = this.state

    return (
      <div className='col-span-12 mla-mail-prepare'>
        <Modal isOpen={true} toggle={this.closeModal} className={'mail-modal'}>
          <Form onSubmit={this.formSubmit}>
            <ModalHeader
              className={'mail-model-header'}
              style={{ backgroundColor: '#253c80', color: 'white' }}
              toggle={this.addevent}
            >
              {title}
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Label>To</Label>
                  <Multiselect
                    options={options} // Options to display in the dropdown
                    selectedValues={selectedValue} // Preselected value to persist in dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue='name' // Property name to display in the dropdown options
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: '15px' }}>
                <Col md={12}>
                  <Label>Title</Label>
                  <input
                    type='text'
                    name='event_title'
                    // validations={[required]}
                    className='form-control'
                    value={event_title}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: '15px' }}>
                {' '}
                <Col>
                  {/* <div class="form-group"> */}
                  <Editor
                    name='description'
                    onChange={this.onChange}
                    className='form-control'
                    value={description}
                    apiKey='tw738oi7eejqelkvij9eko7n5fnt0xd7v90seimw8zjvehzc'
                    init={{
                      plugins: 'link image code',
                      toolbar:
                        'undo redo | bold italic | alignleft aligncenter alignright | code',
                      branding: false
                    }}
                  />
                  {/* </div> */}
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                className=' btn btn-primary '
                color='primary'
                type='submit'
              >
                Add
              </Button>{' '}
              <Button
                className=' btn btn-primary '
                color='danger'
                onClick={this.closeModal}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default PrepareMail
