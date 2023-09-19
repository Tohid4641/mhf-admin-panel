import React from 'react'
import './App.scss'
import counterpart from 'counterpart'

import Main from './main'

import storeFactory from './store'
import { Provider } from 'react-redux'
import storeProvider from './store/storeProvider'

import en from './language/en'
import ta from './language/ta'

counterpart.registerTranslations('en', en)
counterpart.registerTranslations('ta', ta)

function App () {
  storeProvider.init(storeFactory)
  const store = storeProvider.getStore()
  const saveState = () =>
    (localStorage['redux-store'] = JSON.stringify(store.getState()))
  store.subscribe(saveState)

  return (
    <Provider store={store}>
      <Main />
      <div className='poweredby'>
        <span className='pb-text'>{"Desing & Developed By"}</span>
        <a href="https://dezentech.com" target="_blank"> 
          <img src={process.env.PUBLIC_URL + "/images/dezen-logo.png"} />
          Dezen Technology Solutions Pvt Ltd
        </a>
      </div>
    </Provider>
  )
}

export default App
