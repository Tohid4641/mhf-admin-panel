// import * as authActions from '../../store/actions/auth';
// import store from '../../store';
import * as Storage from './localstorage'

var errorService = {
  checkErrors: function (data) {
    if (data && data.message) {
      let message = data.message
      if (typeof message === 'string' || message instanceof String) {
        message = message.toLowerCase()
        if (message === 'network request failed') {
          return { status: false, msg: 'Please check your network connection.' }
        }
      }
    }

    return data
  },

  checkSession: function (data) {
    let message = data.msg
    if (typeof message === 'string' || message instanceof String) {
      message = message ? message.toLowerCase() : ''
      console.log(message)
      if (
        message === 'session expired' ||
        message === 'mobile number or token wrong.'
      ) {
        // store.dispatch(authActions.sessionExpired(true));

        Storage.clear()
        window.location.reload()

        return { ...data, sessionExpired: true }
      }
    }

    return { ...data, sessionExpired: false }
  },

  checkResponseCode: function (data) {
    Storage.clear()
    window.location.reload()
  }
}

export default errorService
