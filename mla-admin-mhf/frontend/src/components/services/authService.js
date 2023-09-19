import qs from 'qs'
import storeProvider from '../../store/storeProvider'
import apiService from './apiService'
import errorService from './errorService'
import axios from 'axios'
var authService = {
  adminLogin: function (token, mobile, otp) {
    const api = storeProvider.getApi()
    let API = api + apiService.adminLogin

    return axios({
      cancelToken: token,
      cancelPreviousRequest: false,
      method: 'post',
      url: API,
      data: qs.stringify({
        mobile: mobile,
        otp: otp
      })
    })
      .then(function (response) {
        var resData = response.data
        if (!resData.success) {
          const message = resData.msg
          const errorRes = {
            status: false,
            data: message,
            code: resData.code,
            msg: message
          }
          const sessionResp = errorService.checkSession(errorRes)
          return sessionResp
        }
        let apiResponse = resData.retailer_info
        apiResponse = resData.supplier_info
        return { status: true, data: apiResponse }
      })
      .catch(function (res) {
        console.log(res)
        console.log('An error occurred in login auth service')
      })
  }
}
export default authService
