import qs from 'qs';
import storeProvider from '../../store/storeProvider';
import apiService from './apiService';
import errorService from './errorService';
import axios from 'axios';

const badRespnseCodes = [401, 400];

var adminService = {
  doEncodeURIComponent: function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);
  },

  Admin_send_otp: function (mobile_no) {
    const api = storeProvider.getApi();
    let API = api + apiService.admin_send_otp;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        mobileNo: mobile_no
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          return errorRes;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  AdminOtp_verification: function (mobileNo, otp) {
    const api = storeProvider.getApi();
    let API = api + apiService.adminLogin;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        mobileNo: mobileNo,
        otp: otp
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          // const message = resData.msg;
          // const errorRes = { status: false, msg: message };
          // return errorRes;
          const message = resData.message;
          const errorRes = {
            status: false,
            data: message,
            code: resData.code,
            msg: message
          };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in auth service');
      });
  },

  getDepartments: function (department_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getDepartments;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        _id: department_id,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          // const message = resData.msg;
          // const errorRes = { status: false, msg: message };
          // return errorRes;
          const message = resData.message;
          const errorRes = {
            status: false,
            data: message,
            code: resData.code,
            msg: message
          };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getDepartment: function (department_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getDepartment;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        departmentId: department_id,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          // const message = resData.msg;
          // const errorRes = { status: false, msg: message };
          // return errorRes;
          const message = resData.message;
          const errorRes = {
            status: false,
            data: message,
            code: resData.code,
            msg: message
          };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  insertDepartment: function (departmentName) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertDepartment;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        departmentName: this.doEncodeURIComponent(departmentName),
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateDepartment: function (departmentName, id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateDepartment;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        departmentName: this.doEncodeURIComponent(departmentName).replace(
          /[!'()*]/g,
          escape
        ),
        departmentId: id,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getEventsProjects: function (eventProjectType, status) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getEventsProjects;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectType: eventProjectType,
        status: true
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  insertEventProject: function (
    event_title,
    event_description,
    event_location,
    startDate,
    file,
    insertType
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertEventProject;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        eventProjectName: this.doEncodeURIComponent(event_title),
        eventProjectFileNames: JSON.stringify(file),
        eventProjectDescription: this.doEncodeURIComponent(event_description),
        eventProjectPlace: this.doEncodeURIComponent(event_location),
        eventProjectDate: startDate,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectType: insertType,

        eventProjectNameLang: this.doEncodeURIComponent(event_title),
        eventProjectPlaceLang: this.doEncodeURIComponent(event_location),
        eventProjectDescriptionLang:
          this.doEncodeURIComponent(event_description)
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateEventProject: function (
    event_title,
    event_description,
    event_location,
    startDate,
    file,
    id,
    insertType
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateEventProject;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectName: this.doEncodeURIComponent(event_title),
        eventProjectDescription: this.doEncodeURIComponent(event_description),
        eventProjectPlace: this.doEncodeURIComponent(event_location),
        eventProjectDate: startDate,
        eventProjectFileNames: JSON.stringify(file),
        eventProjectType: insertType,
        eventProjectId: id,

        eventProjectNameLang: this.doEncodeURIComponent(event_title),
        eventProjectPlaceLang: this.doEncodeURIComponent(event_location),
        eventProjectDescriptionLang:
          this.doEncodeURIComponent(event_description)
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getEventDetails: function (event_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getEventDetails;
    console.log(event_id);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectId: event_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getProjectDetails: function (project_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getEventDetails;
    console.log(project_id);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectId: project_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  fileUpload: function (file) {
    const api = storeProvider.getApi();
    let API = api + apiService.fileUpload;

    var bodyFormData = new FormData();
    Object.keys(file).map((key) => {
      bodyFormData.append('files', file[key]);
      return true;
    });

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: bodyFormData
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData.data;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  s3Upload: function (file) {
    const api = storeProvider.getApi();
    let API = api + apiService.s3file_imageUpload;

    var bodyFormData = new FormData();
    bodyFormData.append('image', file);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: bodyFormData
    })
      .then(function (response) {
        const apiResponse = response.data;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  fileUploadsingle: function (file) {
    const api = storeProvider.getApi();
    let API = api + apiService.fileUpload;

    var bodyFormData = new FormData();
    Object.keys(file).map((key) => {
      bodyFormData.append('files', file[key]);
      return true;
    });
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: bodyFormData
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData.data;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateProfile: function (
    name,
    qualification,
    address,
    mobile_no,
    links,
    file
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateProfile;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        fullName: name,
        qualification: this.doEncodeURIComponent(qualification),
        aboutMLA: this.doEncodeURIComponent(address),
        mobileNo: mobile_no,
        mlaPhoto: file,
        social: links,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getProfile: function (id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getProfile;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        _id: id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  insertContact: function (
    firstName,
    lastName,
    role,
    address,
    mobile_no,
    email,
    file,
    insertType
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertContacts;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        firstName: this.doEncodeURIComponent(firstName),
        lastName: this.doEncodeURIComponent(lastName),
        role: this.doEncodeURIComponent(role),
        address: this.doEncodeURIComponent(address),
        mobileNo: mobile_no,
        email: email,
        profilePhoto: file,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        headOfService: insertType
        // eventProjectType: "Event"
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getContactList: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getContacts;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
        // contactNumberId: contact_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getContactDetails: function (contact_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.contactDetails;
    // console.log(contactNumberId);
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        contactNumberId: contact_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getServiceHeadDetails: function (serviceheads_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.contactDetails;
    // console.log(contactNumberId);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        contactNumberId: serviceheads_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateContactHeadService: function (
    firstName,
    lastName,
    role,
    address,
    mobile_no,
    email,
    fileName,
    id,
    insertType
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateContactHeadService;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        firstName: this.doEncodeURIComponent(firstName),
        lastName: this.doEncodeURIComponent(lastName),
        role: this.doEncodeURIComponent(role),
        address: this.doEncodeURIComponent(address),
        mobileNo: mobile_no,
        email: email,
        profilePhoto: fileName,
        contactNumberId: id,
        headOfService: insertType
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  deleteContactHeadService: function (id, insertType) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deletetDetails;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        contactNumberId: id,
        headOfService: insertType
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  deleteEvent: function (id, eventProjectType) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deletetEvent;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectId: id,
        eventProjectType: eventProjectType,
        status: false
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  deleteDepartment: function (id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateDeptStatus;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        departmentId: id,
        departmentStatus: false
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  deleteAlbum: function (id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deleteAlbum;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        albumId: id,
        albumstatus: false
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getComplaints: function (status) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getComplaints;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintStatus: status
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(resData);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  complaintsFilter: function (status, publish, sDate, eData) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.complaintsFilter;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintStatus: status,
        published: publish,
        dateFrom: sDate,
        dateTo: eData
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(resData);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          console.log(errorRes);
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getComplaintDetails: function (complaintId) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.complaintDetails;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintId: complaintId
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(resData);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateComplaintStatus: function (complaintId, complaintStatus) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateComplaint;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintId: complaintId,
        complaintReplyDescription: 'RepDesc',
        complaintStatus: complaintStatus
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateComplaintPublish: function (complaintId, status) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateComplaintPublish;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintId: complaintId,
        complaintPublish: status
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  complaintNumber: function (complaintId, complaintStatus) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.complaint_number;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        complaintNumber: complaintId
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateContactUs: function (data) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateContactUs;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        mobileNo: data,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getContactUs: function (id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getContactUs;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        _id: id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getAlbums: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getAlbums;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        albumstatus: true
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getAlbum: function (albumId) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getAlbum;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        albumId: albumId
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  insertAlbum: function (album_title, fileName) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertAlbum;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        albumTitle: this.doEncodeURIComponent(album_title),
        albumFiles: JSON.stringify(fileName),
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  updateAlbum: function (album_title, fileName, id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateAlbum;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        albumTitle: this.doEncodeURIComponent(album_title),
        albumFiles: JSON.stringify(fileName),
        albumId: id,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  userList: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.userList;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  headOfServiceList: function (token, mobileNoAdmin, contact_id) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.headOfServiceList;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        contactNumberId: contact_id
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  complaintsCount: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.complaintsCount;
    // console.log(contactNumberId);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        complaintStatus: 'All',
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  eventsCount: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.eventProjectsCount;
    // console.log(contactNumberId);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        eventProjectType: 'Event',
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  projectsCount: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.eventProjectsCount;
    // console.log(contactNumberId);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        eventProjectType: 'Project',
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  usersCount: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.usersCount;
    // console.log(contactNumberId);

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  getfilterEvents: function (eventProjectType, startDate, endDate) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.filter_events;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectType: eventProjectType,
        dateFrom: startDate,
        dateTo: endDate
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  getfilterProjectEvents: function (eventProjectType, startDate, endDate) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.filter_events;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        eventProjectType: eventProjectType,
        dateFrom: startDate._d,
        dateTo: endDate._d
        // eventStatus: status
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  socialMediaLinkings: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.socialMediaLinkings;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  insertSocialMediaLinking: function (socialMediaType, socialMediaTypeUrl) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertSocialMediaLinking;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        socialMediaType: socialMediaType,
        socialMediaTypeUrl: this.doEncodeURIComponent(socialMediaTypeUrl)
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },

  socialMediaLinkingUpdate: function (
    socialMediaLinkingId,
    socialMediaType,
    socialMediaTypeUrl
  ) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.socialMediaLinkingUpdate;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        socialMediaLinkingId: socialMediaLinkingId,
        socialMediaType: socialMediaType,
        socialMediaTypeUrl: this.doEncodeURIComponent(socialMediaTypeUrl)
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  //..  Membership API's Start ..//
  insertMember: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.insertMember;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  updateMember: function (details) {

    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.update_membership;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in update membership service');
      });
  },
  addMember: function (details) {

    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.add_membership;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in update membership service');
      });
  },
  deleteMember: function (memberId) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deleteMember;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        id: memberId
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in delete member');
      });
  },
  getMembersList: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getMembersList;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo,
        status: details.status
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  usersListByMembershipStatus: function (token, details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.usersListByMembershipStatus;
    return axios({
      method: 'POST',
      url: API,
      cancelToken: token,
      cancelPreviousRequest: true,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  usersListByMembershipExpiryDate: function (token, details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.usersListByMembershipExpiryDate;
    return axios({
      method: 'POST',
      url: API,
      cancelToken: token,
      cancelPreviousRequest: true,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  getMembersDetails: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getMembersDetails;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member details');
      });
  },
  updateMemberShipStatus: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateMemberShipStatus;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  updateMemberShipDate: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateMemberShipDate;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  deleteMemberAccount: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deleteMemberAccount;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  //..  Membership API's End ..//

  //..  Hospitals API's Start ..//
  addHospital: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.addHospital;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  updateHospital: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateHospital;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  deleteHospital: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deleteHospital;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in delete member');
      });
  },
  getHospitalList: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getHospitalList;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  getHospitalDetails: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getHospitalDetails;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member details');
      });
  },
  //..  Hospitals API's End ..//

  //..  Doctors API's Start ..//
  addDoctor: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.addDoctor;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  updateDoctor: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.updateDoctor;

    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }

        console.log(res);
        console.log('An error occurred in Retaileractive auth service');
      });
  },
  deleteDoctor: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.deleteDoctor;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in delete member');
      });
  },
  getDoctorsList: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getDoctorsList;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  getDoctorDetails: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getDoctorDetails;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        // console.log(response);
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member details');
      });
  },
  //..  Doctors API's End ..//

  //..  Stats API's  ..//
  getStats: function () {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.getStats;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  },
  exportMembersList: function (details) {
    const api = storeProvider.getApi();
    const adminInfo = storeProvider.getAdminUserInfo();
    let API = api + apiService.exportMembersList;
    return axios({
      method: 'POST',
      url: API,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({
        ...details,
        token: adminInfo.token,
        mobileNoAdmin: adminInfo.mobileNo
      })
    })
      .then(function (response) {
        var resData = response.data;
        if (!resData.status) {
          const message = resData.message;
          const errorRes = { status: false, msg: message };
          const sessionResp = errorService.checkSession(errorRes);
          return sessionResp;
        }
        const apiResponse = resData;
        return { status: true, data: apiResponse };
      })
      .catch(function (res) {
        if (
          res &&
          res.response &&
          res.response.status &&
          badRespnseCodes.indexOf(res.response.status) > -1
        ) {
          errorService.checkResponseCode(res);
        }
        console.log(res);
        console.log('An error occurred in member list');
      });
  }
};

export default adminService;
