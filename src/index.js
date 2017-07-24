import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import App from './containers/App'

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const intialState = {
	entryPoint: 'http://localhost:8080/hydra/entrypoint',
	currentHydraAPIDoc: 'http://localhost:8080/hydra/api-doc'
}

const store = createStore(
  reducer,
  intialState,
  applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
)