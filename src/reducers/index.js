import { combineReducers } from 'redux'
// import {
//   SELECT_REDDIT, INVALIDATE_REDDIT,
//   REQUEST_POSTS, RECEIVE_POSTS
// } from '../actions'
import {
  CHANGE_HYDRA_API_DOC, 
  INVALIDATE_HYDRA_API_DOC,
  REQUEST_HYDRA_API_DOC, 
  RECEIVE_HYDRA_API_DOC
} from '../actions'
import {
  CHANGE_IRI_FOR_FRAME, INVALIDATE_FRAME,
  REQUEST_DOC_FOR_FRAME, RECEIVE_DOC_FOR_FRAME
} from '../actions'

// Testing redux-form
import { reducer as reduxFormReducer } from 'redux-form'
import account from '../containers/account';

// const selectedReddit = (state = 'reactjs', action) => {
//   switch (action.type) {
//     case SELECT_REDDIT:
//       return action.reddit
//     default:
//       return state
//   }
// }

// const posts = (state = {
//   isFetching: false,
//   didInvalidate: false,
//   items: []
// }, action) => {
//   switch (action.type) {
//     case INVALIDATE_REDDIT:
//       return {
//         ...state,
//         didInvalidate: true
//       }
//     case REQUEST_POSTS:
//       return {
//         ...state,
//         isFetching: true,
//         didInvalidate: false
//       }
//     case RECEIVE_POSTS:
//       return {
//         ...state,
//         isFetching: false,
//         didInvalidate: false,
//         items: action.posts,
//         lastUpdated: action.receivedAt
//       }
//     default:
//       return state
//   }
// }

// const postsByReddit = (state = { }, action) => {
//   switch (action.type) {
//     case INVALIDATE_REDDIT:
//     case RECEIVE_POSTS:
//     case REQUEST_POSTS:
//       return {
//         ...state,
//         [action.reddit]: posts(state[action.reddit], action)
//       }
//     default:
//       return state
//   }
// }

// -------------------
// Hydra
// -------------------

// const currentHydraDoc = (state = 'http://localhost:8080/hydra/entrypoint', action) => {
//   switch (action.type) {
//     case CHANGE_HYDRA_DOC:
//       return action.iri
//     default:
//       return state
//   }
// }

const entryPoint = (state = '', action) => {
  return state
}

const currentHydraAPIDoc = (state = '', action) => {
  switch (action.type) {
    case CHANGE_HYDRA_API_DOC:
      return action.iri
    default:
      return state
  }
}

const processHydraDoc = (state = {
  isFetching: false,
  didInvalidate: false,
  content: {}
  // items: []
}, action) => {
  switch (action.type) {
    // case INVALIDATE_HYDRA_DOC:
    case INVALIDATE_HYDRA_API_DOC:
    case INVALIDATE_FRAME:
      return {
        ...state,
        didInvalidate: true
      }
    // case REQUEST_HYDRA_DOC:
    case REQUEST_HYDRA_API_DOC:
    case REQUEST_DOC_FOR_FRAME:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    // case RECEIVE_HYDRA_DOC:
    case RECEIVE_HYDRA_API_DOC:
    case RECEIVE_DOC_FOR_FRAME:
      // TODO: State needs to be immutable - copy action.doc into new object
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        content: action.doc,
        // items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

// const hydraDoc = (state = { }, action) => {
//   switch (action.type) {
//     case INVALIDATE_HYDRA_DOC:
//     case RECEIVE_HYDRA_DOC:
//     case REQUEST_HYDRA_DOC:
//       return processHydraDoc(state, action)
//     default:
//       return state
//   }
// }

const hydraAPIDoc = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_HYDRA_API_DOC:
    case RECEIVE_HYDRA_API_DOC:
    case REQUEST_HYDRA_API_DOC:
      return processHydraDoc(state, action)
    default:
      return state
  }
}


// -------------------
// Hydra Browsing by Frame
// -------------------

const currentIRIForFrame = (state = { }, action) => {
  switch (action.type) {
    case CHANGE_IRI_FOR_FRAME:
      return {
        ...state,
        [action.frameId]: action.iri
      }
    default:
      return state
  }
}

const hydraDocByFrameId = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_FRAME:
    case RECEIVE_DOC_FOR_FRAME:
    case REQUEST_DOC_FOR_FRAME:
      return {
        ...state,
        [action.frameId]: processHydraDoc(state[action.frameId], action)
      }
    default:
      return state
  }
}


const rootReducer = combineReducers({
  // postsByReddit,
  // selectedReddit,

  // Hydra
  // currentHydraDoc,
  entryPoint,
  currentHydraAPIDoc,
  // hydraDoc,
  hydraAPIDoc,
  hydraDocByFrameId,
  currentIRIForFrame,

  // Testing for redux-form
  form: reduxFormReducer,
  account
})

export default rootReducer