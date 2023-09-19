import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import autheReducers from './reducers/auth'
const rootReducer = combineReducers({
  auth: autheReducers
})

const consoleMessages = store => next => action => {
  let result

  result = next(action)
  return result
}

// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
export default (initialState = {}) => {
  return applyMiddleware(thunk, consoleMessages)(createStore)(rootReducer, {})
}

// export default store;
