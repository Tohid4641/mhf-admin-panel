export const AUTHENTICATE = 'AUTHENTICATE'
export const UPDATE_CONFIG = 'UPDATE_CONFIG'
export const UPDATE_COMPLAINT_FILTERS = 'UPDATE_COMPLAINT_FILTERS'
export const UPDATE_EVENT_STATUS_FILTER = 'UPDATE_EVENT_STATUS_FILTER'
export const UPDATE_CURRENT_LANGUAGE = 'UPDATE_CURRENT_LANGUAGE'

export const authenticate = data => {
  return { type: AUTHENTICATE, data: data }
}

export const updateConfig = config => {
  return { type: UPDATE_CONFIG, data: config }
}

export const updateComplaintFilters = status => {
  return { type: UPDATE_COMPLAINT_FILTERS, data: status }
}

export const updateEventStatusFilter = status => {
  return { type: UPDATE_EVENT_STATUS_FILTER, data: status }
}

export const updateCurrentLanguage = data => {
  return { type: UPDATE_CURRENT_LANGUAGE, data: data }
}
