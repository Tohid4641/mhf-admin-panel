import React from 'react'
import cookie from 'react-cookies'

import './albumForm.scss'
import { Row, Col, Card, FormGroup, Button, CardBody, Label } from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import 'react-datepicker/dist/react-datepicker.css'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import adminService from '../../services/adminService'
import validators from '../../validators/validators'
// import { SortablePane, Pane } from 'react-sortable-pane';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Select from 'react-select'

import Translate from 'react-translate-component'

// const apiKeygoogle = "AIzaSyAeG_Jp2Pu2t2hMWHUk1neKkLUAtL-UGfo";
// const apiKey = apiKeygoogle;

// const googleTranslate = require("google-translate")(apiKey);

class AlbumForm extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    const data = []
    for (let i = 1, len = 7; i < len; i++) {
      data.push({
        title: `rows${i}`
      })
    }

    this.state = {
      album_title: '',
      apiError: '',
      file: '',
      fileUpload: '',
      newfiles: [],
      startDate: new Date(),
      Date1: '',
      authenticating: false,
      updateAlbum: false,
      albumDetails: {},

      inputs: [],
      options: [
        { label: 'upload video', value: 2 },
        { label: 'Youtube url', value: 1 }
      ],

      selectOptions: [
        { label: 'upload video', value: 2 },
        { label: 'Youtube url', value: 1 }
      ],

      // items: getItems(5),
      languageCodes: [],
      language: cookie.load('language') ? cookie.load('language') : 'en',
      question: cookie.load('question')
        ? cookie.load('question')
        : // : "What language do you prefer to read ?"
          ''
    }
    this.validators = validators
  }

  componentDidMount () {
    console.log(this.props)
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ updateAlbum: true })

      this.getAlbumDetails(this.props.match.params.album_id)
    }
  }

  addVideoDumyyItem = () => {
    let { inputs, options } = this.state
    inputs.push({ type: options[0], value: '' })
    this.setState({ inputs })
  }

  removeInputs = index => {
    this.state.inputs.splice(index, 1)
    this.setState({ inputs: this.state.inputs })
  }

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
      if (field === 'album_title') {
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

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
    this.updateValidators([e.target.name], e.target.value)
  }

  onChangeFileHandler = e => {
    this.setState({
      [e.target.name]: e.target.files
    })
    let thisView = this
    let file1 = Array.from(e.target.files)
    thisView.setState({ newfiles: file1 })
  }

  handleChange = date => {
    this.setState({
      startDate: date
    })
  }

  handleSubmit (event) {
    // this.form.validateAll();

    event.preventDefault()

    // if (!this.state.event_catergory) {
    //         this.setState({ event_catergoryError: true });
    //     return;
    // } else {
    //     this.setState({ event_catergoryError: false, event_sub_catergoryError: false });
    // }

    this.setState({ authenticating: true })

    this.files3Upload()
  }

  fileUpload () {
    const { file, albumFileNames } = this.state
    var thisView = this
    this.setState({ authenticating: true })
    axios
      .all([adminService.fileUpload(file)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data
          let filesReferencesList = []

          resData.map(eachResponse => {
            if (eachResponse.filename)
              filesReferencesList.push(eachResponse.filename)
            return true
          })

          if (albumFileNames && albumFileNames.length > 0) {
            albumFileNames.map(eachFile => {
              return filesReferencesList.push(eachFile)
            })
          }

          thisView.videoUpload(filesReferencesList)
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  files3Upload () {
    const { file, albumFileNames } = this.state

    let files = []
    if (file && file.length > 0) {
      Object.keys(file).map((key, index) => {
        files.push(file[key])
        return true
      })
    }

    this.setState({ authenticating: true })
    var thisView = this
    axios
      .all(files.map(eachFile => adminService.s3Upload(eachFile)))
      .then(function (res) {
        if (res) {
          let filesReferencesList = []
          res.map(eachResp => {
            let resData = eachResp.data
            if (resData.fileName) {
              filesReferencesList.push(resData.fileName)
            }
            return true
          })

          if (albumFileNames && albumFileNames.length > 0) {
            albumFileNames.map(eachFile => {
              return filesReferencesList.push(eachFile)
            })
          }

          thisView.videos3Upload(filesReferencesList)
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  videoUpload (imagesList) {
    const { inputs, albumVideoFileNames } = this.state

    let files = [],
      urls = [],
      previews = []
    let videoFormValid = true
    inputs.map(eachInput => {
      if (eachInput.type && eachInput.type.value === 1) {
        if (eachInput.value && eachInput.value.trim() !== '')
          urls.push(eachInput.value)
        else videoFormValid = false
      } else if (eachInput.type && eachInput.type.value === 2) {
        if (eachInput.value) {
          Object.keys(eachInput.value).map(key => {
            files.push(eachInput.value[key])
            return true
          })
        } else videoFormValid = false
      }
      if (eachInput.preview) previews.push(eachInput.preview[0])
      else videoFormValid = false
      return true
    })

    if (!videoFormValid) {
      this.setState({ videoUploadError: true, authenticating: false })
      return
    } else this.setState({ videoUploadError: false })

    var thisView = this
    axios
      .all([adminService.fileUpload(files), adminService.fileUpload(previews)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data
          let resDataFiles = res[1].data

          let videosUrls = []
          let uploadCount = 0
          let directUrlCount = 0
          inputs.map((eachInput, index) => {
            if (eachInput.type && eachInput.type.value === 1) {
              videosUrls.push(
                urls[directUrlCount] + '||||' + resDataFiles[index]['filename']
              )
              directUrlCount += 1
            } else if (eachInput.type && eachInput.type.value === 2) {
              videosUrls.push(
                resData[uploadCount]['filename'] +
                  '||||' +
                  resDataFiles[index]['filename']
              )
              uploadCount++
            }
            return true
          })

          if (albumVideoFileNames && albumVideoFileNames.length > 0) {
            albumVideoFileNames.map(eachFile => {
              return videosUrls.push(eachFile)
            })
          }

          let combineFiles = {
            images: imagesList,
            videos: videosUrls
          }

          if (thisView.state.updateAlbum)
            thisView.updateAlbum(JSON.stringify(combineFiles))
          else thisView.addAlbum(JSON.stringify(combineFiles))
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  videos3Upload (imagesList) {
    const { inputs, albumVideoFileNames } = this.state

    let files = [],
      urls = [],
      previews = []
    let videoFormValid = true
    inputs.map((eachInput, index) => {
      if (eachInput.type && eachInput.type.value === 1) {
        if (eachInput.value && eachInput.value.trim() !== '')
          urls.push(eachInput.value)
        else videoFormValid = false
      } else if (eachInput.type && eachInput.type.value === 2) {
        if (eachInput.value) {
          Object.keys(eachInput.value).map(key => {
            files.push(eachInput.value[key])
            return true
          })
        } else videoFormValid = false
      }
      if (eachInput.preview) previews.push(eachInput.preview[0])
      else videoFormValid = false
      return true
    })

    if (!videoFormValid) {
      this.setState({ videoUploadError: true, authenticating: false })
      return
    } else this.setState({ videoUploadError: false })

    let combineFiles = files.concat(previews)

    var thisView = this
    axios
      .all(combineFiles.map(eachFile => adminService.s3Upload(eachFile)))
      .then(function (res) {
        if (res) {
          // let resData = res[0].data;
          // let resDataFiles = res[1].data;

          let resData = []
          let resDataFiles = []
          res.map((eachResp, index) => {
            let tempData = eachResp.data
            if (files.length >= index + 1) {
              resData.push({ filename: tempData.fileName })
            } else {
              resDataFiles.push({ filename: tempData.fileName })
            }
            return true
          })

          let videosUrls = []
          let uploadCount = 0
          let directUrlCount = 0
          inputs.map((eachInput, index) => {
            if (eachInput.type && eachInput.type.value === 1) {
              videosUrls.push(
                urls[directUrlCount] + '||||' + resDataFiles[index]['filename']
              )
              directUrlCount += 1
            } else if (eachInput.type && eachInput.type.value === 2) {
              videosUrls.push(
                resData[uploadCount]['filename'] +
                  '||||' +
                  resDataFiles[index]['filename']
              )
              uploadCount++
            }
            return true
          })

          if (albumVideoFileNames && albumVideoFileNames.length > 0) {
            albumVideoFileNames.map(eachFile => {
              videosUrls.push(eachFile)
              return true
            })
          }

          let combineFiles = {
            images: imagesList,
            videos: videosUrls
          }

          if (thisView.state.updateAlbum)
            thisView.updateAlbum(JSON.stringify(combineFiles))
          else thisView.addAlbum(JSON.stringify(combineFiles))
        }
      })
      .catch(function (res) {
        console.log(res)
        if (res.message) console.log('An error occurred in file upload')
      })
  }

  addAlbum = fileName => {
    const { album_title } = this.state
    var thisView = this

    this.setState({ authenticating: true })
    axios
      .all([adminService.insertAlbum(album_title, fileName)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            thisView.props.history.push('/albums')
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

  getAlbumDetails = album_id => {
    var thisView = this
    axios
      .all([adminService.getAlbum(album_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            let album = resData.data
            let albumDetails = {}
            let albumFiles = album.albumFiles
              ? album.albumFiles.replace(/quot;/g, '"')
              : ''
            // let albumFiles = album.albumFiles ? album.albumFiles.replace(/\&quot;/g, '"' ) : "";
            albumDetails = {
              id: album._id,
              albumTitle: album.albumTitle,
              albumFiles: JSON.parse(albumFiles),
              albumDate: album.createdAt
            }
            console.log(albumDetails)
            if (albumDetails.albumFiles) {
              if (albumDetails.albumFiles && albumDetails.albumFiles.images) {
                let albumFileNames = albumDetails.albumFiles.images
                thisView.setState({ albumFileNames })
              }
              if (albumDetails.albumFiles && albumDetails.albumFiles.videos) {
                let albumVideoFileNames = albumDetails.albumFiles.videos
                thisView.setState({ albumVideoFileNames })
              }
            }

            let album_title = albumDetails.albumTitle
            let fileName = albumDetails.albumFiles

            let validate = {
              album_title
            }

            // to update in the state variable
            Object.keys(validate).map(key => {
              thisView.updateValidators([key], validate[key])
              return true
            })

            thisView.setState({ album_title, fileName })
            thisView.setState({ albumDetails })
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

  updateAlbum = fileName => {
    const { album_title } = this.state
    var thisView = this
    let id = this.props.match.params.album_id

    this.setState({ authenticating: true })
    axios
      .all([adminService.updateAlbum(album_title, fileName, id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data
          if (resData.status) {
            // thisView.props.history.push("/mlaprofile");
            thisView.props.history.push('/albums/' + id)
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

  numberoffile = () => {
    const { newfiles } = this.state
    if (newfiles.length === 0) {
      return null
    }
    return (
      <p
        style={{
          marginBottom: '0rem',
          paddingLeft: '4px',
          display: 'inline-block'
        }}
      >
        file({newfiles.length})
      </p>
    )
  }

  changeHandler = language => {
    // let cookieLanguage = cookie.load("language");
    // let transQuestion = "";

    // const translating = transQuestion => {
    //     if (question !== transQuestion) {
    //         this.setState({ question: transQuestion });
    //         cookie.save("question", transQuestion, { path: "/" });
    //     }
    // };

    this.setState({ language })
    cookie.save('language', language, { path: '/' })
  }

  renderUsers = (item, index) => {
    return (
      <Draggable key={index} draggableId={index + ' '} index={index}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='item mx-auto'>
              {/* <div>{index + 1}</div> */}
              <div>
                <img
                  className='imgefiles mx-auto'
                  style={{ width: '230px' }}
                  name='file'
                  onChange={this.onChangeFileHandler}
                  src={this.props.config.s3BasicPath + item}
                  alt='avatar'
                />
              </div>
              <div className='transp-layer'></div>
              <i
                className='fa fa-window-close asset-remove'
                onClick={() => {
                  this.removeImage(item, index)
                }}
              />
              {/* <div className='name'>
                            <div>{item.firstName}</div>
                            <div>{item.lastName}</div>
                        </div> */}
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  removeImage = (item, index) => {
    console.log(item, index)
    let albumFileNames = this.state.albumFileNames
    albumFileNames.splice(index, 1)
    this.setState({ albumFileNames })
  }

  renderVideo = (item, index) => {
    let splitData = item.split('||||')

    return (
      <Draggable key={index} draggableId={index + ' '} index={index}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='item mx-auto'>
              <div key={index} className='player-wrapper'>
                <img
                  className='imgefiles mx-auto'
                  style={{ width: '230px' }}
                  name='file'
                  onChange={this.onChangeFileHandler}
                  src={this.props.config.s3BasicPath + splitData[1]}
                  alt='avatar'
                />
                <div className='transp-layer'></div>
                <i
                  className='fa fa-window-close asset-remove'
                  onClick={() => {
                    this.removeVideo(item, index)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  removeVideo = (item, index) => {
    console.log(item, index)
    let albumVideoFileNames = this.state.albumVideoFileNames
    albumVideoFileNames.splice(index, 1)
    this.setState({ albumVideoFileNames })
  }

  videoTypeChnage = (selectedOption, updateIndex) => {
    let inputs = this.state.inputs

    inputs = inputs.map((eachVideo, index) => {
      if (updateIndex === index) {
        return { ...eachVideo, type: selectedOption }
      } else {
        return { ...eachVideo }
      }
    })
    this.setState({ inputs })
  }

  onVideoInputChange = (e, updateIndex, type) => {
    // this.updateValidators([e.target.name], e.target.value);
    console.log(e.target.files)
    let inputs = this.state.inputs

    inputs = inputs.map((eachVideo, index) => {
      if (updateIndex === index) {
        if (type === 'preview') {
          let files = Array.from(e.target.files)
          return { ...eachVideo, preview: files }
        } else {
          return {
            ...eachVideo,
            value: type === 'url' ? e.target.value : e.target.files
          }
        }
      } else {
        return { ...eachVideo }
      }
    })
    console.log(inputs)
    this.setState({ inputs })
  }

  onDragEnd = result => {
    const { destination, source, reason } = result
    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const albumFileNames = Object.assign([], this.state.albumFileNames)
    const droppedUser = this.state.albumFileNames[source.index]

    albumFileNames.splice(source.index, 1)
    albumFileNames.splice(destination.index, 0, droppedUser)
    this.setState({
      albumFileNames
    })
  }

  onDragEndVideo = result => {
    const { destination, source, reason } = result
    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const albumVideoFileNames = Object.assign(
      [],
      this.state.albumVideoFileNames
    )
    const droppedUser = this.state.albumVideoFileNames[source.index]

    albumVideoFileNames.splice(source.index, 1)
    albumVideoFileNames.splice(destination.index, 0, droppedUser)
    this.setState({
      albumVideoFileNames
    })
  }

  render () {
    const { authenticating, albumFileNames, albumVideoFileNames } = this.state
    return (
      <div className='col-span-12 mla-album-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className='col-span-12 lg:col-span-10'>
            <div className='box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  <Translate content='album form' />
                </h2>
              </div>

              <Row>
                <Col md={12}>
                  <Card className=' card-statistics mb-5'>
                    <CardBody>
                      <Form onSubmit={this.handleSubmit}>
                        <Row>
                          <Col md={12}>
                            <FormGroup>
                              <Label>
                                <Translate content='title' />
                              </Label>
                              <Input
                                htmlFor='drugName'
                                type='text'
                                name='album_title'
                                // validations={[required]}
                                className='form-control'
                                value={this.state.album_title}
                                onChange={this.onChange}
                                placeholder=' Title'
                                autoFocus={true}
                              />
                              {this.displayValidationErrors('album_title')}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          {albumFileNames && albumFileNames.length > 0 && (
                            <Col md={6}>
                              <Translate content='images' />

                              <DragDropContext onDragEnd={this.onDragEnd}>
                                <div className='container images_list'>
                                  <div className='users'>
                                    <Droppable droppableId='dp1'>
                                      {provided => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                        >
                                          {albumFileNames.map(this.renderUsers)}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </div>
                                </div>
                              </DragDropContext>
                            </Col>
                          )}

                          {albumVideoFileNames &&
                            albumVideoFileNames.length > 0 && (
                              <Col md={6}>
                                <Translate content='videos' />

                                <DragDropContext
                                  onDragEnd={this.onDragEndVideo}
                                >
                                  <div className='container videos_list'>
                                    <div className='users'>
                                      <Droppable droppableId='dp1'>
                                        {provided => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                          >
                                            {albumVideoFileNames.map(
                                              this.renderVideo
                                            )}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  </div>
                                </DragDropContext>
                              </Col>
                            )}
                        </Row>

                        <Row>
                          <Col md={12}>
                            <FormGroup>
                              <Label>
                                {' '}
                                <Translate content='upload images' />
                              </Label>

                              <label
                                for='file-upload'
                                style={{ marginLeft: '5px' }}
                                className='custom-file-upload'
                              >
                                <i className='text-info fa fa-cloud-upload'></i>
                                <Translate content='choose file' />
                              </label>
                              <input
                                type='file'
                                id='file-upload'
                                name='file'
                                accept='image/*'
                                onChange={this.onChangeFileHandler}
                                multiple
                              />

                              {this.numberoffile()}

                              {this.state.newfiles &&
                                this.state.newfiles.map((files, index) => (
                                  <p style={{ marginBottom: '0rem' }}>
                                    {files.name}
                                  </p>
                                ))}
                            </FormGroup>
                          </Col>
                        </Row>
                        <hr />

                        <Row>
                          <Col md={6} className='mt-2 mb-2'>
                            <Translate content='upload videos' />
                          </Col>
                          {this.state.inputs && this.state.inputs.length === 0 && (
                            <Col md={6} className='mt-2 mb-2'>
                              <i
                                style={{ fontSize: '15px' }}
                                className='fa fa-plus circle-icon add-first-video'
                                onClick={this.addVideoDumyyItem}
                              />
                            </Col>
                          )}
                        </Row>

                        {this.state.inputs.map((eachVideo, index) => {
                          return (
                            <div key={index} className='mt-3'>
                              <Row>
                                <Col md={3}>
                                  <FormGroup>
                                    <Label>
                                      <Translate content='select' />{' '}
                                    </Label>
                                    <Select
                                      name=''
                                      className='selectbox '
                                      onChange={option => {
                                        this.videoTypeChnage(option, index)
                                      }}
                                      options={this.state.options}
                                      isSearchable
                                      value={eachVideo.type}
                                      // validations={[required]}
                                      style={{ border: 'none !important' }}
                                    />
                                  </FormGroup>
                                </Col>
                                {eachVideo.type && (
                                  <Col md={3}>
                                    {eachVideo.type.value === 1 ? (
                                      <FormGroup>
                                        <Label>
                                          <Translate content='add url' />
                                        </Label>
                                        {/* <span>{eachVideo.value}</span> */}
                                        <input
                                          type='text'
                                          name={'addCustomUrl' + index}
                                          // validations={[required]}
                                          className='form-control video-url'
                                          value={
                                            eachVideo.value
                                              ? eachVideo.value
                                              : ''
                                          }
                                          onChange={e => {
                                            this.onVideoInputChange(
                                              e,
                                              index,
                                              'url'
                                            )
                                          }}
                                          placeholder='Add Url'
                                        />
                                        {/* {this.displayValidationErrors('addUrl')} */}
                                      </FormGroup>
                                    ) : (
                                      <FormGroup>
                                        <Label>
                                          {' '}
                                          <Translate content='upload videos' />
                                        </Label>

                                        <label
                                          for={'file-upload' + index}
                                          style={{ marginLeft: '5px' }}
                                          className='custom-file-upload'
                                        >
                                          <i className='text-info fa fa-cloud-upload'></i>
                                          {eachVideo.value &&
                                          eachVideo.value.length > 0 ? (
                                            <p className='video-file'>
                                              {eachVideo.value[0]['name']}
                                            </p>
                                          ) : (
                                            <Translate content='choose file' />
                                          )}
                                        </label>
                                        <input
                                          type='file'
                                          id={'file-upload' + index}
                                          name='file'
                                          accept='video/*'
                                          onChange={e => {
                                            this.onVideoInputChange(
                                              e,
                                              index,
                                              'video'
                                            )
                                          }}
                                          multiple
                                        />
                                        {/* <input type="file" name="file" accept="video/*"
                                                                                     onChange={(e) => { this.onVideoInputChange(e, index, "video") }} /> */}

                                        {/* {this.numberoffile()} */}

                                        {eachVideo.type.value &&
                                          Object.keys(eachVideo.type.value).map(
                                            (key, fileIndex) => (
                                              <p
                                                style={{ marginBottom: '0rem' }}
                                                key={fileIndex}
                                              >
                                                {eachVideo.type.value[key].name}
                                              </p>
                                            )
                                          )}
                                      </FormGroup>
                                    )}
                                  </Col>
                                )}
                                <Col md={3}>
                                  <FormGroup>
                                    <Label>
                                      <Translate content='video preview' />{' '}
                                    </Label>
                                    <label
                                      for={'file-upload-preview' + index}
                                      style={{ marginLeft: '5px' }}
                                      className='custom-file-upload'
                                    >
                                      <i className='text-info fa fa-cloud-upload'></i>
                                      {eachVideo.preview &&
                                      eachVideo.preview.length > 0 ? (
                                        <p className='preview-file'>
                                          {eachVideo.preview[0]['name']}
                                        </p>
                                      ) : (
                                        <Translate content='choose file' />
                                      )}
                                    </label>
                                    <input
                                      type='file'
                                      id={'file-upload-preview' + index}
                                      name={'file' + index}
                                      accept='image/*'
                                      onChange={e => {
                                        this.onVideoInputChange(
                                          e,
                                          index,
                                          'preview'
                                        )
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col
                                  md={2}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <div className='text-center'>
                                    <i
                                      style={{ fontSize: '15px' }}
                                      className='fa fa-close circle-icon-close'
                                      onClick={() => this.removeInputs(index)}
                                    />
                                    &nbsp;&nbsp;
                                    <i
                                      style={{ fontSize: '15px' }}
                                      className='fa fa-plus circle-icon'
                                      onClick={this.addVideoDumyyItem}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          )
                        })}

                        {!authenticating ? (
                          <Button
                            style={{ float: 'right' }}
                            className=' btn btn-primary mt-3'
                            color='primary'
                            type='submit'
                            disabled={this.isFormValid() ? false : true}
                          >
                            {this.state.updateAlbum ? (
                              <span className='text-white'>
                                <Translate content='update' />
                              </span>
                            ) : (
                              <span className='text-white'>
                                <Translate content='publish' />
                              </span>
                            )}
                          </Button>
                        ) : (
                          <i
                            className='fa fa-spin fa-refresh authentication-loading'
                            style={{ float: 'right' }}
                          />
                        )}
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

const mapStateToProps = state => ({
  config: state.auth.config
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumForm)
