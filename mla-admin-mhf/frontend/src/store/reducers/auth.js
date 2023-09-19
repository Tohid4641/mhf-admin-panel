import {
  AUTHENTICATE,
  UPDATE_CONFIG,
  UPDATE_COMPLAINT_FILTERS,
  UPDATE_CURRENT_LANGUAGE
} from '../actions/auth'

const initialState = {
  config: {},
  token: null,
  userId: null,
  profileData: null,
  mobileNo: null,
  complaintFilters: null,
  currentLanguage: 'en'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      return {
        ...state,
        config: action.data
      }

    case AUTHENTICATE:
      return {
        ...state,
        token: action.data.token,
        mobileNo: action.data.mobileNo,
        profileData: action.data.profile
      }

    case UPDATE_COMPLAINT_FILTERS:
      return {
        ...state,
        complaintFilters: action.data
      }

    case UPDATE_CURRENT_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.data
      }

    default:
      return state
  }
}
