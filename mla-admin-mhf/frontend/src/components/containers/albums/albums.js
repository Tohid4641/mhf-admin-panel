import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap'
import adminService from '../../services/adminService'
import { connect } from 'react-redux'
import { updateEventStatusFilter } from '../../../store/actions/auth'
import Translate from 'react-translate-component'

import './albums.scss'

class Albums extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      albumsList: [],
      albumsMain: [],
      searchText: '',
      fetchingDetails: false,
      msg: true,
      apiSuccess: '',
      albumtid: '',
      modal: false
    }
  }

  componentDidMount () {
    this.getAlbums()
  }

  getAlbums = (refresh = false) => {
    var thisView = this
    if (!refresh) thisView.setState({ fetchingDetails: true })
    axios
      .all([adminService.getAlbums()])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          let albums = resData.data ? resData.data : []
          let albumsList = albums.map((eachAlbum, index) => {
            // let albumFiles = eachAlbum.albumFiles ? eachAlbum.albumFiles.replace(/\&quot;/g, '"') : "";
            let albumFiles = eachAlbum.albumFiles
              ? eachAlbum.albumFiles.replace(/quot;/g, '"')
              : ''
            return {
              id: eachAlbum._id,
              details: {
                index: index,
                id: eachAlbum._id,
                albumTitle: eachAlbum.albumTitle,
                albumFiles: JSON.parse(albumFiles),
                albumDate: eachAlbum.createdAt
              }
            }
          })
          thisView.setState({ albumsList, albumsMain: albumsList })
        }

        thisView.setState({ fetchingDetails: false })
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  formatAlbum = (cell, row) => {
    return (
      <NavLink to={this.props.match.path + '/' + cell.id} className='mlac-each'>
        <div className='mlace-head'>
          <span>{cell.albumTitle}</span>
          <span className='mlac-status'>
            <i
              className='fa fa-edit mlac-edit'
              onClick={e => {
                this.updateAlbum(e, cell)
              }}
            />
            <span>
              <i
                className='fa fa-trash mlac-delete'
                style={{ cursor: 'pointer' }}
                onClick={e => {
                  this.toggle(e, cell.id)
                }}
              />
            </span>
          </span>
        </div>
        <div className='mlace-content' sm={12}>
          {cell.albumFiles &&
            cell.albumFiles.images &&
            cell.albumFiles.images.length > 0 &&
            cell.albumFiles.images.map((eachImage, index) => {
              return (
                <div>
                  <img
                    src={this.props.config.s3BasicPath + eachImage}
                    alt='porfile'
                  />
                </div>
              )
            })}
        </div>
      </NavLink>
    )
  }

  deleteAlbum = () => {
    var thisView = this
    thisView.setState({ authenticating: true, msg: !this.state.msg })

    this.setState({ authenticating: true })
    axios
      .all([adminService.deleteAlbum(this.state.albumtid)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.setState({ apiSuccess: 'Album deleted successfully ' })

            // if (insertType === "")
            //     thisView.props.history.push("/contacts");
            // else if (insertType === "headOfService")
            //     thisView.props.history.push("/serviceheads");

            // setTimeout(() => window.location.reload(), thisView.props.history.push("/contacts"), window.location.reload(), 4000);
            setTimeout(
              () => thisView.setState({ modal: !thisView.state.modal }),
              1000
            )
            // setTimeout(() => thisView.getAlbums(), 2000);
            thisView.getAlbums(true)
          } else {
            thisView.setState({ apiError: resData.msg })
          }
        }
        thisView.setState({ authenticating: false })
        // setTimeout(() => window.location.reload(), thisView.setState({ modal: false }), 4000);
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in change Password')
      })
  }

  toggle = (e, cell) => {
    e.preventDefault()
    if (cell) {
      this.setState({ albumtid: cell })
    }
    this.setState({
      modal: !this.state.modal
    })
    console.log(cell)
  }

  updateAlbum = (e, cell) => {
    e.preventDefault()
    this.props.history.push(this.props.match.path + '/update/' + cell.id)
  }

  filterAlbums = event => {
    let searchText = this.state.searchText
    if (event) searchText = event.target.value

    let albumsList = []
    if (searchText && searchText.length >= 2) {
      albumsList = this.state.albumsMain.filter(eachEvent => {
        if (
          eachEvent.details.albumTitle
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1
        )
          return true
        else return false
      })
    } else {
      albumsList = this.state.albumsMain
    }

    this.setState({ searchText, albumsList })
  }

  render () {
    const { match } = this.props
    const { albumsList, fetchingDetails } = this.state

    return (
      <div className='col-span-12 mlac-album'>
        <div className='col-span-12 xxl:col-span-9'>
          <div className='intro-y flex items-end mt-10'>
            {/* <h2 className='text-lg text-black font-medium'></h2> */}
            <NavLink
              to={match.path + '/add'}
              className='ml-auto flex text-theme-1'
            >
              <Translate content='add' />
            </NavLink>
          </div>
        </div>

        <Modal
          isOpen={this.state.modal}
          style={{ marginTop: '0px', marginLeft: '0px' }}
        >
          <ModalHeader
            style={{ backgroundColor: '#253c80', color: 'white' }}
            toggle={this.toggle}
          >
            Confimation{' '}
          </ModalHeader>
          <ModalBody>
            {this.state.msg && (
              <p>Are you sure you want to delete this Album</p>
            )}
            {this.state.apiSuccess && (
              <div className='errormsg'>
                <Alert color='success'>{this.state.apiSuccess}</Alert>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {!this.state.authenticating ? (
              <Button
                className=' btn btn-primary '
                color='danger'
                onClick={this.deleteAlbum}
              >
                <span className='text-white'>Delete</span>
              </Button>
            ) : (
              <i className='fa fa-spin fa-refresh authentication-loading' />
            )}
          </ModalFooter>
        </Modal>

        <Row className='intro-y mt-3 mb-3'>
          <Col md={8}>
            <h2 className='font-weight-bold'>
              <Translate content='albums' />{' '}
            </h2>
          </Col>
          <Col md={4}></Col>
        </Row>

        <Row className={'intro-y'}>
          {!fetchingDetails ? (
            <Col sm md lg={12} className='mb-30'>
              <Card className='card-statistics h-100'>
                <Row className='mlac-search-container'>
                  <Col xs={12} sm={12} md={6} lg={8}></Col>
                  <Col xs={12} sm={12} md={6} lg={4}>
                    <input
                      className='form-control mlac-search'
                      value={this.state.field_search_input}
                      placeholder={'Search'}
                      onChange={this.filterAlbums}
                      onKeyDown={this.filterAlbums}
                      ref={input => {
                        this.searchInput = input
                      }}
                    />
                  </Col>
                </Row>

                <CardBody>
                  <BootstrapTable
                    data={albumsList}
                    pagination
                    striped
                    condensed
                    // search
                  >
                    <TableHeaderColumn
                      className='mlac-row'
                      dataField='details'
                      dataFormat={this.formatAlbum}
                      isKey
                    ></TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <i className='fa fa-spin fa-refresh initial_loading' />
          )}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  eventStatusFilter: state.auth.eventStatusFilter,
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({
  updatingEventStatusFilter (data) {
    dispatch(updateEventStatusFilter(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Albums)
