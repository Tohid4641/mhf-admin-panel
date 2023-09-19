import React from 'react';
import cookie from 'react-cookies';
import './eventsForm.scss';
import { Row, Col, Card, FormGroup, Button, CardBody, Label } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Textarea from 'react-validation/build/textarea';
import adminService from '../../services/adminService';
import validators from '../../validators/validators';
// import { MDBView, MDBContainer, MDBRow, MDBCol } from "mdbreact";
// import ReactPlayer from 'react-player';
// import { SortablePane, Pane } from 'react-sortable-pane';
import Translate from 'react-translate-component';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';

const apiKeygoogle = 'AIzaSyAeG_Jp2Pu2t2hMWHUk1neKkLUAtL-UGfo';
const apiKey = apiKeygoogle;
const googleTranslate = require('google-translate')(apiKey);

// const required = (value, props) => {
//     if (!value || (props.isCheckable && !props.checked)) {
//         return <span className="form-error is-visible">Required</span>;
//     }
// };

class EventsForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    const data = [];
    for (let i = 1, len = 7; i < len; i++) {
      data.push({
        title: `rows${i}`
      });
    }

    this.state = {
      apiError: '',
      event_title: '',
      event_subtitle: '',
      event_catergory: null,
      event_catergoryError: false,
      event_sub_catergory: null,
      event_sub_catergoryError: false,
      event_description: '',
      event_location: '',
      file: '',
      fileUpload: '',
      newfiles: [],
      startDate: new Date(),
      Date1: '',
      authenticating: false,
      updateEvent: false,
      eventDetails1: [],
      eventDetails: {},
      filesProjectFileNames: [],
      filesProjectVideoFileNames: [],
      upload: '',
      upload1: '',
      addUrl: '',
      videoshow: false,
      urlshow: true,
      videoUploadError: false,
      inputs: [],
      options: [
        { label: 'Upload Video', value: 2 },
        { label: 'Youtube Url', value: 1 }
      ],

      selectOptions: [
        { label: 'Upload Video', value: 2 },
        { label: 'Youtube Url', value: 1 }
      ],
      // items: getItems(5),
      languageCodes: [],
      language: cookie.load('language') ? cookie.load('language') : 'en',
      question: cookie.load('question')
        ? cookie.load('question')
        : // : "What language do you prefer to read ?"
          ''
    };
    this.validators = validators;
  }

  onDragEnd = (result) => {
    const { destination, source, reason } = result;
    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const filesProjectFileNames = Object.assign(
      [],
      this.state.filesProjectFileNames
    );
    const droppedUser = this.state.filesProjectFileNames[source.index];

    filesProjectFileNames.splice(source.index, 1);
    filesProjectFileNames.splice(destination.index, 0, droppedUser);
    this.setState({
      filesProjectFileNames
    });
  };

  renderUsers = (item, index) => {
    // let { config } = this.props
    return (
      <Draggable key={index} draggableId={index + ' '} index={index}>
        {(provided) => (
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
                  src={
                    item.substring(0, 4) === 'http'
                      ? item
                      : this.porps.config.fileBasicPath + item
                  }
                  alt='avatar'
                />
              </div>
              <div className='transp-layer'></div>
              <i
                className='fa fa-window-close asset-remove'
                onClick={() => {
                  this.removeImage(item, index);
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
    );
  };

  removeImage = (item, index) => {
    console.log(item, index);
    let filesProjectFileNames = this.state.filesProjectFileNames;
    filesProjectFileNames.splice(index, 1);
    this.setState({ filesProjectFileNames });
  };

  onDragEndVideo = (result) => {
    const { destination, source, reason } = result;
    // Not a thing to do...
    if (!destination || reason === 'CANCEL') {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const filesProjectVideoFileNames = Object.assign(
      [],
      this.state.filesProjectVideoFileNames
    );
    const droppedUser = this.state.filesProjectVideoFileNames[source.index];

    filesProjectVideoFileNames.splice(source.index, 1);
    filesProjectVideoFileNames.splice(destination.index, 0, droppedUser);
    this.setState({
      filesProjectVideoFileNames
    });
  };

  renderVideo = (item, index) => {
    let splitData = item.split('||||');
    let preview = splitData[1] ? splitData[1] : '';
    let { config } = this.props;

    return (
      <Draggable key={index} draggableId={index + ' '} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='item mx-auto'>
              <div>
                <img
                  className='imgefiles mx-auto'
                  style={{ width: '230px' }}
                  name='file'
                  onChange={this.onChangeFileHandler}
                  src={
                    preview.substring(0, 4) === 'http'
                      ? preview
                      : config.fileBasicPath + preview
                  }
                  alt='avatar'
                />
              </div>
              <div className='transp-layer'></div>
              <i
                className='fa fa-window-close asset-remove'
                onClick={() => {
                  this.removeVideo(item, index);
                }}
              />
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  removeVideo = (item, index) => {
    console.log(item, index);
    let filesProjectVideoFileNames = this.state.filesProjectVideoFileNames;
    filesProjectVideoFileNames.splice(index, 1);
    this.setState({ filesProjectVideoFileNames });
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.location.pathname.indexOf('update') > -1) {
      this.setState({ updateEvent: true });

      if (this.props.location.pathname.indexOf('events') > -1)
        this.getEventDetails();
      else if (this.props.location.pathname.indexOf('projects') > -1)
        this.getProjectDetails();
    }
  }

  addVideoDumyyItem = () => {
    let { inputs, options } = this.state;
    inputs.push({ type: options[0], value: '' });
    this.setState({ inputs });
  };

  getEventDetails = () => {
    var thisView = this;
    axios
      .all([adminService.getEventDetails(this.props.match.params.event_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let eventDetails = resData.data;
            if (eventDetails.eventProjectFileNames) {
              eventDetails.eventProjectFileNames = JSON.parse(
                eventDetails.eventProjectFileNames
              );
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.images
              ) {
                let filesProjectFileNames =
                  eventDetails.eventProjectFileNames.images;
                thisView.setState({ filesProjectFileNames });
              }
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.videos
              ) {
                let filesProjectVideoFileNames =
                  eventDetails.eventProjectFileNames.videos;
                thisView.setState({ filesProjectVideoFileNames });
              }
              // console.log(files);
            } else eventDetails.eventProjectFileNames = {};

            let event_title = eventDetails.eventProjectName;
            let event_description = eventDetails.eventProjectDescription;
            let event_location = eventDetails.eventProjectPlace;
            let startDate = new Date(eventDetails.eventProjectDate); //moment(eventDetails.eventProjectDate).format("") ? eventDetails.eventProjectDate : '';
            let fileName = eventDetails.eventProjectFileNames;

            let validate = {
              event_title,
              event_description,
              event_location
            };
            console.log(eventDetails.eventProjectDate);
            // to update in the state variable
            Object.keys(validate).map((key) => {
              thisView.updateValidators([key], validate[key]);
              return true;
            });

            thisView.setState({
              event_title,
              event_description,
              event_location,
              startDate,
              fileName
            });
            thisView.setState({ eventDetails });
            thisView.setState({ Success_msg: '' });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  };

  getProjectDetails = () => {
    var thisView = this;
    axios
      .all([adminService.getProjectDetails(this.props.match.params.project_id)])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let eventDetails = resData.data;

            if (eventDetails.eventProjectFileNames) {
              eventDetails.eventProjectFileNames = JSON.parse(
                eventDetails.eventProjectFileNames
              );
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.images
              ) {
                let filesProjectFileNames =
                  eventDetails.eventProjectFileNames.images;
                thisView.setState({ filesProjectFileNames });
              }
              if (
                eventDetails.eventProjectFileNames &&
                eventDetails.eventProjectFileNames.videos
              ) {
                let filesProjectVideoFileNames =
                  eventDetails.eventProjectFileNames.videos;
                thisView.setState({ filesProjectVideoFileNames });
              }
              // console.log(files);
            } else eventDetails.eventProjectFileNames = {};

            let event_title = eventDetails.eventProjectName;
            let event_description = eventDetails.eventProjectDescription;
            let event_location = eventDetails.eventProjectPlace;
            let startDate = new Date(eventDetails.eventProjectDate); //moment(eventDetails.eventProjectDate).format("") ? eventDetails.eventProjectDate : '';
            let fileName = eventDetails.eventProjectFileNames;

            let validate = {
              event_title,
              event_description,
              event_location
            };
            Object.keys(validate).map((key) => {
              thisView.updateValidators([key], validate[key]);
              return true;
            });

            thisView.setState({
              event_title,
              event_description,
              event_location,
              startDate,
              fileName
            });
            console.log('updated');
            thisView.setState({ eventDetails });

            thisView.setState({ Success_msg: '' });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  };

  updateValidators = (fieldName, value) => {
    this.validators[fieldName].errors = [];
    this.validators[fieldName].state = value;
    this.validators[fieldName].valid = true;
    this.validators[fieldName].rules.forEach((rule) => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  };

  isFormValid = () => {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (
        field === 'event_title' ||
        field === 'event_location' ||
        field === 'event_description'
      ) {
        if (!this.validators[field].valid) {
          status = false;
        }
      }
    });
    return status;
  };

  displayValidationErrors = (fieldName) => {
    const validator = this.validators[fieldName];
    const result = '';
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className='error' key={index}>
            * {info}
            <br />
          </span>
        );
      });
      return <div className='col s12 row'>{errors}</div>;
    }
    return result;
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.updateValidators([e.target.name], e.target.value);
  }

  onChangeFileHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.files
    });
    let thisView = this;
    let file1 = Array.from(e.target.files);
    thisView.setState({ newfiles: file1 });
  };

  onPreviewChangeFileHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.files
    });
    let thisView = this;
    let file1 = Array.from(e.target.files);
    thisView.setState({ newfiles: file1 });
  };

  handleChange = (date) => {
    this.setState({
      startDate: date
    });
  };

  handleChange1 = (selectedOption) => {
    this.setState({
      upload: selectedOption
    });
    this.toggle1();
    // console.log(this.setState({
    //     event_catergory: selectedOption.label
    // }))
  };

  toggle1 = () => {
    if (this.state.upload === 'Add url') {
      this.setState({ urlshow: !this.state.urlshow });
    } else {
      this.setState({
        videoshow: !this.state.videoshow,
        urlshow: !this.state.urlshow
      });
    }
  };

  handleChange2 = (selectedOption) => {
    this.setState({
      upload1: selectedOption
    });
  };

  handleSubmit(event) {
    // this.form.validateAll();

    event.preventDefault();

    // if (!this.state.event_catergory) {
    //         this.setState({ event_catergoryError: true });
    //     return;
    // } else {
    //     this.setState({ event_catergoryError: false, event_sub_catergoryError: false });
    // }

    // this.setState({ authenticating: true });

    // this.files3Upload();
    this.fileUpload();
  }

  fileUpload() {
    const { file, filesProjectFileNames } = this.state;

    let files = [];
    if (file && file.length > 0) {
      Object.keys(file).map((key, index) => {
        files.push(file[key]);
        return true;
      });
    }

    this.setState({ authenticating: true });
    var thisView = this;
    axios
      .all([adminService.fileUpload(files)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data;
          let filesReferencesList = [];

          resData.map((eachResponse) => {
            if (eachResponse.filename)
              filesReferencesList.push(eachResponse.filename);
            return true;
          });

          if (filesProjectFileNames && filesProjectFileNames.length > 0) {
            filesProjectFileNames.map((eachFile) => {
              return filesReferencesList.push(eachFile);
            });
          }

          thisView.videoUpload(filesReferencesList);
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in file upload');
      });
  }

  files3Upload() {
    const { file, filesProjectFileNames } = this.state;

    let files = [];
    if (file && file.length > 0) {
      Object.keys(file).map((key, index) => {
        files.push(file[key]);
        return true;
      });
    }

    this.setState({ authenticating: true });
    var thisView = this;
    axios
      .all(files.map((eachFile) => adminService.fileUpload(eachFile)))
      .then(function (res) {
        if (res) {
          let filesReferencesList = [];
          res.map((eachResp) => {
            let resData = eachResp.data;
            if (resData.fileName) {
              filesReferencesList.push(resData.fileName);
            }
            return true;
          });

          if (filesProjectFileNames && filesProjectFileNames.length > 0) {
            filesProjectFileNames.map((eachFile) => {
              return filesReferencesList.push(eachFile);
            });
          }

          thisView.videos3Upload(filesReferencesList);
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in file upload');
      });
  }

  videoUpload(imagesList) {
    const { inputs, filesProjectVideoFileNames } = this.state;

    let files = [],
      urls = [],
      previews = [];
    let videoFormValid = true;
    inputs.map((eachInput, index) => {
      if (eachInput.type && eachInput.type.value === 1) {
        if (eachInput.value && eachInput.value.trim() !== '')
          urls.push(eachInput.value);
        else videoFormValid = false;
      } else if (eachInput.type && eachInput.type.value === 2) {
        if (eachInput.value) {
          Object.keys(eachInput.value).map((key) => {
            files.push(eachInput.value[key]);
            return true;
          });
        } else videoFormValid = false;
      }
      if (eachInput.preview) previews.push(eachInput.preview[0]);
      else videoFormValid = false;
      return true;
    });

    if (!videoFormValid) {
      this.setState({ videoUploadError: true, authenticating: false });
      return;
    } else this.setState({ videoUploadError: false });

    var thisView = this;
    axios
      .all([adminService.fileUpload(files), adminService.fileUpload(previews)])
      .then(function (res) {
        if (res) {
          let resData = res[0].data;
          let resDataFiles = res[1].data;

          let videosUrls = [];
          let uploadCount = 0;
          let directUrlCount = 0;
          inputs.map((eachInput, index) => {
            if (eachInput.type && eachInput.type.value === 1) {
              videosUrls.push(
                urls[directUrlCount] + '||||' + resDataFiles[index]['filename']
              );
              directUrlCount += 1;
            } else if (eachInput.type && eachInput.type.value === 2) {
              videosUrls.push(
                resData[uploadCount]['filename'] +
                  '||||' +
                  resDataFiles[index]['filename']
              );
              uploadCount++;
            }
            return true;
          });

          console.log(videosUrls);
          // return;

          if (
            filesProjectVideoFileNames &&
            filesProjectVideoFileNames.length > 0
          ) {
            filesProjectVideoFileNames.map((eachFile) => {
              return videosUrls.push(eachFile);
            });
          }

          let combineFiles = {
            images: imagesList,
            videos: videosUrls
          };

          if (thisView.state.updateEvent)
            thisView.updateEventProject(JSON.stringify(combineFiles));
          else thisView.addEventProject(JSON.stringify(combineFiles));
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in file upload');
      });
  }

  videos3Upload(imagesList) {
    const { inputs, filesProjectVideoFileNames } = this.state;

    let files = [],
      urls = [],
      previews = [];
    let videoFormValid = true;
    inputs.map((eachInput, index) => {
      if (eachInput.type && eachInput.type.value === 1) {
        if (eachInput.value && eachInput.value.trim() !== '')
          urls.push(eachInput.value);
        else videoFormValid = false;
      } else if (eachInput.type && eachInput.type.value === 2) {
        if (eachInput.value) {
          Object.keys(eachInput.value).map((key) => {
            files.push(eachInput.value[key]);
            return true;
          });
        } else videoFormValid = false;
      }
      if (eachInput.preview) previews.push(eachInput.preview[0]);
      else videoFormValid = false;
      return true;
    });

    if (!videoFormValid) {
      this.setState({ videoUploadError: true, authenticating: false });
      return;
    } else this.setState({ videoUploadError: false });

    let combineFiles = files.concat(previews);
    // let youtubeBasePath = this.props.config.youtubeBasePath

    var thisView = this;
    axios
      .all(combineFiles.map((eachFile) => adminService.fileUpload(eachFile)))
      .then(function (res) {
        if (res) {
          // let resData = res[0].data;
          // let resDataFiles = res[1].data;

          let resData = [];
          let resDataFiles = [];
          res.map((eachResp, index) => {
            let tempData = eachResp.data;
            if (files.length >= index + 1) {
              resData.push({ filename: tempData.fileName });
            } else {
              resDataFiles.push({ filename: tempData.fileName });
            }
            return true;
          });

          let videosUrls = [];
          let uploadCount = 0;
          let directUrlCount = 0;
          inputs.map((eachInput, index) => {
            if (eachInput.type && eachInput.type.value === 1) {
              videosUrls.push(
                urls[directUrlCount] + '||||' + resDataFiles[index]['filename']
              );
              directUrlCount += 1;
            } else if (eachInput.type && eachInput.type.value === 2) {
              videosUrls.push(
                resData[uploadCount]['filename'] +
                  '||||' +
                  resDataFiles[index]['filename']
              );
              uploadCount++;
            }
            return true;
          });

          if (
            filesProjectVideoFileNames &&
            filesProjectVideoFileNames.length > 0
          ) {
            filesProjectVideoFileNames.map((eachFile) => {
              return videosUrls.push(eachFile);
            });
          }

          let combineFiles = {
            images: imagesList,
            videos: videosUrls
          };

          if (thisView.state.updateEvent)
            thisView.updateEventProject(JSON.stringify(combineFiles));
          else thisView.addEventProject(JSON.stringify(combineFiles));
        }
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in file upload');
      });
  }

  addEventProject = (fileName) => {
    const { event_location, event_title, event_description, startDate } =
      this.state;
    var thisView = this;

    let insertType = 'Event';
    if (this.props.location.pathname.indexOf('projects') > -1)
      insertType = 'Project';

    this.setState({ authenticating: true });
    axios
      .all([
        adminService.insertEventProject(
          event_title,
          event_description,
          event_location,
          startDate,
          fileName,
          insertType
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            if (insertType === 'Event') thisView.props.history.push('/events');
            else if (insertType === 'Project')
              thisView.props.history.push('/projects');
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ authenticating: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  };

  updateEventProject = (fileName) => {
    const { event_location, event_title, event_description, startDate } =
      this.state;
    var thisView = this;

    let insertType = 'Event';
    let id = this.props.match.params.event_id;
    if (this.props.location.pathname.indexOf('projects') > -1) {
      insertType = 'Project';
      id = this.props.match.params.project_id;
    }

    this.setState({ authenticating: true });
    axios
      .all([
        adminService.updateEventProject(
          event_title,
          event_description,
          event_location,
          startDate,
          fileName,
          id,
          insertType
        )
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            if (insertType === 'Event')
              thisView.props.history.push('/events/' + id);
            else if (insertType === 'Project')
              thisView.props.history.push('/projects/' + id);
          } else {
            thisView.setState({ apiError: resData.msg });
          }
        }
        thisView.setState({ authenticating: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log('An error occurred in change Password');
      });
  };

  numberoffile = () => {
    const { newfiles } = this.state;
    if (newfiles.length === 0) {
      return null;
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
    );
  };

  changeHandler = (language) => {
    let { question } = this.state;
    let cookieLanguage = cookie.load('language');
    let transQuestion = '';

    const translating = (transQuestion) => {
      if (question !== transQuestion) {
        this.setState({ question: transQuestion });
        cookie.save('question', transQuestion, { path: '/' });
      }
    };

    // translate the question when selecting a different language
    if (language !== cookieLanguage) {
      googleTranslate.translate(
        question,
        language,
        function (err, translation) {
          transQuestion = translation.translatedText;
          translating(transQuestion);
        }
      );
    }

    this.setState({ language });
    cookie.save('language', language, { path: '/' });
  };

  addInputs = () => {
    this.setState({ inputs: [...this.state.inputs, ''] });
  };

  removeInputs = (index) => {
    this.state.inputs.splice(index, 1);
    this.setState({ inputs: this.state.inputs });
  };

  videoTypeChnage = (selectedOption, updateIndex) => {
    let inputs = this.state.inputs;

    inputs = inputs.map((eachVideo, index) => {
      if (updateIndex === index) {
        return { ...eachVideo, type: selectedOption, value: '' };
      } else {
        return { ...eachVideo };
      }
    });
    this.setState({ inputs });
  };

  onVideoInputChange = (e, updateIndex, type) => {
    // this.updateValidators([e.target.name], e.target.value);
    console.log(e.target.files);
    let inputs = this.state.inputs;

    inputs = inputs.map((eachVideo, index) => {
      if (updateIndex === index) {
        if (type === 'preview') {
          let files = Array.from(e.target.files);
          return { ...eachVideo, preview: files };
        } else {
          return {
            ...eachVideo,
            value: type === 'url' ? e.target.value : e.target.files
          };
        }
      } else {
        return { ...eachVideo };
      }
    });
    console.log(inputs);
    this.setState({ inputs });
  };

  render() {
    const { authenticating } = this.state;
    // console.log(languageCodes);
    // console.log(language);
    // console.log(this.state.users);
    // console.log(eventDetails)

    return (
      <div className='col-span-12 mla-event-form'>
        <div className='grid grid-cols-12 gap-6 mt-8'>
          <div className=' col-span-10'>
            <div className=' box'>
              <div className='flex flex-col sm:flex-row items-center p-5 border-b border-gray-200'>
                <h2 className='font-medium text-base mr-auto'>
                  {/* <Translate content="events form" /> */}
                  Activities & Announcements Form
                </h2>
              </div>

              <Row>
                <Col md={12}>
                  <Card className=' card-statistics mb-30'>
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
                                name='event_title'
                                // validations={[required]}
                                className='form-control'
                                value={this.state.event_title}
                                onChange={this.onChange}
                                placeholder=' Title'
                                autoFocus={true}
                              />
                              {this.displayValidationErrors('event_title')}
                            </FormGroup>
                          </Col>

                          {/* <Col md={6}>
                                                        <FormGroup>
                                                            <Label>Sub Title</Label>
                                                            <Input type="text"
                                                                name="event_subtitle"
                                                                // validations={[required]}
                                                                className="form-control"
                                                                value={this.state.event_subtitle}
                                                                onChange={this.onChange}
                                                                placeholder=" Sub Title" />
                                                            {this.displayValidationErrors('event_subtitle')}

                                                        </FormGroup>
                                                    </Col> */}
                        </Row>

                        {/* <Row>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label> Category</Label>

                                                            <Select
                                                                className="selectbox w-full  mt-2 flex-1"
                                                                onChange={this.handleChange1}
                                                                options={this.state.options}
                                                                isSearchable
                                                                value={this.state.event_catergory}
                                                                // validations={[required]}
                                                                style={{ border: 'none !important' }}
                                                            />
                                                            {
                                                                this.state.event_catergoryError &&
                                                                <span className="form-error is-visible">Required</span>
                                                            }
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label>Sub Category </Label>
                                                            <Select
                                                                name="event_sub_catergory" className="selectbox w-full  mt-2 flex-1"
                                                                onChange={this.handleChange2}
                                                                options={this.state.options}
                                                                isSearchable
                                                                value={this.state.event_sub_catergory}
                                                                // validations={[required]}
                                                                style={{ border: 'none !important' }}
                                                            />
                                                            {
                                                                this.state.event_sub_catergoryError &&
                                                                <span className="form-error is-visible">Required</span>
                                                            }


                                                        </FormGroup>
                                                    </Col>
                                                </Row> */}

                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label>
                                <Translate content='date' />
                              </Label>
                              <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                showTimeSelect
                                timeFormat='HH:mm'
                                timeIntervals={15}
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa'
                                className='form-control'
                                style={{ width: '100% !important' }}
                              />
                              {this.displayValidationErrors('Date1')}
                            </FormGroup>
                          </Col>

                          <Col md={6}>
                            <FormGroup>
                              <Label>
                                <Translate content='location' />
                              </Label>
                              <Input
                                type='text'
                                name='event_location'
                                // validations={[required]}
                                className='form-control'
                                value={this.state.event_location}
                                onChange={this.onChange}
                                placeholder='Event Location'
                              />
                              {this.displayValidationErrors('event_location')}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <FormGroup>
                              <Label>
                                {' '}
                                <Translate content='description' />{' '}
                              </Label>
                              <Textarea
                                type='text'
                                name='event_description'
                                // validations={[required]}
                                className='form-control'
                                value={this.state.event_description}
                                onChange={this.onChange}
                                rows={4}
                                cols={50}
                              />
                              {this.displayValidationErrors(
                                'event_description'
                              )}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row className='mb-4'>
                          {this.state.filesProjectFileNames &&
                            this.state.filesProjectFileNames.length > 0 && (
                              <Col md={6}>
                                <Translate content='images' />

                                <DragDropContext onDragEnd={this.onDragEnd}>
                                  <div className='container'>
                                    <div className='users'>
                                      <Droppable droppableId='dp1'>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                          >
                                            {this.state.filesProjectFileNames.map(
                                              this.renderUsers
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

                          {this.state.filesProjectVideoFileNames &&
                            this.state.filesProjectVideoFileNames.length >
                              0 && (
                              <Col md={6}>
                                <Translate content='videos' />

                                <DragDropContext
                                  onDragEnd={this.onDragEndVideo}
                                >
                                  <div className='container'>
                                    <div className='users'>
                                      <Droppable droppableId='dp2'>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                          >
                                            {this.state.filesProjectVideoFileNames.map(
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

                        {/* <Row>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label>  Upload Images </Label>
                                                            <label for="file-upload" style={{ marginLeft: "5px" }} className="custom-file-upload">
                                                                <i className="text-info fa fa-cloud-upload"></i> Choose Files
                                                            </label>
                                                            <input type="file" id="file-upload" name="file"
                                                                accept="image/*, video/*"
                                                                onChange={this.onChangeFileHandler}
                                                                multiple />

                                                            {this.numberoffile()}


                                                            {this.state.newfiles && this.state.newfiles.map((files, index) => (
                                                                <p style={{ marginBottom: "0rem" }}>{files.name}</p>
                                                            ))}
                                                        </FormGroup>
                                                    </Col>


                                                    <Col md={6}>
                                                    <FormGroup>
                                                            <Label>  Upload Videos</Label>

                                                            <label for="file-upload" style={{ marginLeft: "5px" }} className="custom-file-upload">
                                                                <i className="text-info fa fa-cloud-upload"></i> Choose Files
                                                            </label>
                                                            <input type="file" id="file-upload" name="file"
                                                                accept="image/*, video/*"
                                                                onChange={this.onChangeFileHandler}
                                                                multiple />

                                                            {this.numberoffile()}


                                                            {this.state.newfiles && this.state.newfiles.map((files, index) => (
                                                                <p style={{ marginBottom: "0rem" }}>{files.name}</p>
                                                            ))}
                                                        </FormGroup>
                                                            </Col>
                                                            </Row> */}
                        <hr />
                        <Row className='mt-2'>
                          <Col>
                            <FormGroup className='mt-4'>
                              <Label>
                                <Translate content='upload images' />
                              </Label>

                              <label
                                for='file-upload'
                                style={{ marginLeft: '5px' }}
                                className='custom-file-upload'
                              >
                                <i className='text-info fa fa-cloud-upload'></i>{' '}
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
                        {/* <Row>
                                                    <Col md={5}>
                                                        <FormGroup>
                                                            <Label>Select </Label>
                                                            <Select
                                                                name="uplaod" className="selectbox "
                                                                onChange={this.handleChange1}
                                                                options={this.state.options}
                                                                isSearchable
                                                                value={this.state.upload}
                                                                // validations={[required]}
                                                                style={{ border: 'none !important' }}
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={5}>
                                                        {this.state.urlshow ?
                                                            <FormGroup>
                                                                <Label>Add Url</Label>
                                                                <Input type="text"
                                                                    name="addUrl"
                                                                    // validations={[required]}
                                                                    className="form-control"
                                                                    value={this.state.addUrl}
                                                                    onChange={this.onChange}
                                                                    placeholder="Add Url" />
                                                                {this.displayValidationErrors('addUrl')}

                                                            </FormGroup>
                                                            : null}

                                                        {this.state.videoshow ?
                                                            <FormGroup className="mt-4">
                                                                <Label>  Upload Videos</Label>

                                                                <label for="file-upload" style={{ marginLeft: "5px" }} className="custom-file-upload">
                                                                    <i className="text-info fa fa-cloud-upload"></i> Choose Files
                                                            </label>
                                                                <input type="file" id="file-upload" name="file"
                                                                    accept="image/*, video/*"
                                                                    onChange={this.onChangeFileHandler}
                                                                    multiple />

                                                                {this.numberoffile()}


                                                                {this.state.newfiles && this.state.newfiles.map((files, index) => (
                                                                    <p style={{ marginBottom: "0rem" }}>{files.name}</p>
                                                                ))}
                                                            </FormGroup>
                                                            : null}

                                                    </Col>


                                                    <Col md={2}>
                                                        <div className="text-center" style={{ marginTop: "40%" }}>
                                                          <i className="fa fa-trash " />&nbsp;&nbsp;
                                                            <i style={{ fontSize: "15px" }} className="fa fa-plus circle-icon" onClick={(e) => this.addInputs(e)} /></div>

                                                    </Col>

                                                </Row> */}

                        {/* <Button className=" btn btn-primary mt-3" color="primary" type="submit" onClick={(e) => this.addInputs(e)}>
                                                    add</Button> */}

                        {this.state.inputs.map((eachVideo, index) => {
                          return (
                            <div key={index}>
                              <Row>
                                <Col md={3}>
                                  <FormGroup>
                                    <Label>
                                      <Translate content='select' />{' '}
                                    </Label>
                                    <Select
                                      name=''
                                      className='selectbox '
                                      onChange={(option) => {
                                        this.videoTypeChnage(option, index);
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
                                          onChange={(e) => {
                                            this.onVideoInputChange(
                                              e,
                                              index,
                                              'url'
                                            );
                                          }}
                                          placeholder={eachVideo.type.label}
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
                                          onChange={(e) => {
                                            this.onVideoInputChange(
                                              e,
                                              index,
                                              'video'
                                            );
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
                                      onChange={(e) => {
                                        this.onVideoInputChange(
                                          e,
                                          index,
                                          'preview'
                                        );
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col
                                  md={3}
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
                          );
                        })}

                        {/* <Row>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label>Select </Label>
                                                            <Select
                                                                name="uplaod" className="selectbox w-full  mt-2 flex-1"
                                                                onChange={this.handleChange2}
                                                                options={this.state.selectOptions}
                                                                isSearchable
                                                                value={this.state.upload1}
                                                                // validations={[required]}
                                                                style={{ border: 'none !important' }}
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup className="mt-4">
                                                            <Label>  Upload Videos</Label>

                                                            <label for="file-upload" style={{ marginLeft: "5px" }} className="custom-file-upload">
                                                                <i className="text-info fa fa-cloud-upload"></i> Choose Files
                                                            </label>
                                                            <input type="file" id="file-upload" name="file"
                                                                accept="image/*, video/*"
                                                                onChange={this.onChangeFileHandler}
                                                                multiple />

                                                            {this.numberoffile()}


                                                            {this.state.newfiles && this.state.newfiles.map((files, index) => (
                                                                <p style={{ marginBottom: "0rem" }}>{files.name}</p>
                                                            ))}
                                                        </FormGroup>
                                                    </Col>
                                                </Row> */}

                        {/* <Label>Location</Label> */}

                        {/* {
                                                        eventDetails.eventProjectFileNames && eventDetails.eventProjectFileNames.length > 0 &&
                                                        <MDBContainer>
                                                            <MDBRow>
                                                                <MDBCol md="12">
                                                                    {
                                                                        eventDetails.eventProjectFileNames.map((eachImage, index) => {
                                                                            return (


                                                                                <MDBView>
                                                                                    <div className="column">
                                                                                        <img key={index} className="d-inline"
                                                                                            src={ config.fileBasicPath + eachImage}
                                                                                            name="file"
                                                                                            alt=""
                                                                                            id="file-upload"
                                                                                            onChange={this.onChangeFileHandler}
                                                                                        />
                                                                                    </div>

                                                                                </MDBView>
                                                                            )
                                                                        })
                                                                    }
                                                                </MDBCol>


                                                            </MDBRow>

                                                        </MDBContainer>
                                                    } */}
                        {/* 
                                                {
                                                    eventDetails.eventProjectFileNames && eventDetails.eventProjectFileNames.length > 0 &&
                                                    <div>
                                                        {
                                                            eventDetails.eventProjectFileNames.map((eachImageVideo, index) => {
                                                                return (
                                                                    <div key={index} className='player-wrapper'>
                                                                        <ReactPlayer
                                                                            className='react-player'
                                                                            url={ config.fileBasicPath + eachImageVideo}
                                                                            width='100%'
                                                                            height='100%'
                                                                            controls={true}
                                                                        />
                                                                    </div>


                                                                )
                                                            })
                                                        }
                                                    </div>
                                                } */}

                        <hr />
                        <br></br>

                        {/* <div className=" flex-col sm:flex-row items-center ">
                                                    <h2 className="text-center font-medium text-base mr-auto">
                                                        <Translate content="tamil" />
                                                    </h2>

                                                </div>


                                                <p>{question}</p>


                                                <br></br>

                                                <Row style={{ marginTop: "13px" }}>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Input htmlFor="drugName"
                                                                type="text"
                                                                name="event_title"
                                                                // validations={[required]}
                                                                className="form-control"
                                                                value={this.state.event_title}
                                                                onChange={this.onChange}
                                                                placeholder=" Title"
                                                            />
                                                            {this.displayValidationErrors('event_title')}

                                                        </FormGroup>
                                                    </Col>

                                                </Row>


                                                <Row>


                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Input type="text"
                                                                name="event_location"
                                                                // validations={[required]}
                                                                className="form-control"
                                                                value={this.state.event_location}
                                                                onChange={this.onChange}
                                                                placeholder="Event Location" />
                                                            {this.displayValidationErrors('event_location')}

                                                        </FormGroup>
                                                    </Col>
                                                </Row>


                                                <Row>

                                                    <Col>
                                                        <FormGroup>
                                                            <Textarea type="text"
                                                                name="event_description"
                                                                // validations={[required]}
                                                                className="form-control"
                                                                value={this.state.event_description}
                                                                onChange={this.onChange} rows={4} cols={50} />
                                                            {this.displayValidationErrors('event_description')}
                                                        </FormGroup>
                                                    </Col>

                                                </Row> */}

                        {!authenticating ? (
                          <Button
                            style={{ float: 'right' }}
                            className=' btn  custom-btn mt-3'
                            color='primary'
                            type='submit'
                            disabled={this.isFormValid() ? false : true}
                          >
                            {this.state.updateEvent ? (
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
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.auth.config
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EventsForm);
