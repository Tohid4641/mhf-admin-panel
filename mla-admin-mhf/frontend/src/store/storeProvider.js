var store = undefined

export default {
  init (configureStore) {
    store = configureStore({})
  },
  getStore () {
    return store
  },
  getCurrentState () {
    return store.getState()
  },
  getApi () {
    var currentState = this.getCurrentState()
    return currentState.auth.config.api
  },
  getCustomerType () {
    var currentState = this.getCurrentState()
    return currentState.auth.customerType
  },
  getAdminUserInfo () {
    var currentState = this.getCurrentState()
    var data = {
      mobileNo: currentState.auth.mobileNo,
      token: currentState.auth.token
    }
    return data
  }
}
