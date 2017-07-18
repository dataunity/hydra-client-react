import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  invalidateHydraAPIDoc, 
  changeHydraAPIDoc,
  fetchHydraAPIDocIfNeeded
} from '../actions'
import IRIEntry from '../components/IRIEntry'
import HydraFrame from './HydraFrame'

class HydraApp extends Component {
  static propTypes = {
    currentHydraAPIDoc: PropTypes.string.isRequired,
    apiDoc: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, currentHydraAPIDoc } = this.props
    dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentHydraAPIDoc !== this.props.currentHydraAPIDoc) {
      console.log("Different Hydra API Doc requested")
      const { dispatch, currentHydraDoc } = nextProps
      dispatch(invalidateHydraAPIDoc(currentHydraDoc))
      dispatch(fetchHydraAPIDocIfNeeded(currentHydraDoc))
    }
  }

  handleIRISubmit = nextIri => {
    this.props.dispatch(changeHydraAPIDoc(nextIri))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, currentHydraAPIDoc } = this.props
    dispatch(invalidateHydraAPIDoc(currentHydraAPIDoc))
    dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
  }

  render() {
    const { currentHydraAPIDoc, isFetching, lastUpdated, apiDoc, entryPoint } = this.props
    const isEmpty = !apiDoc["@type"]

    return (
      <div>
        <IRIEntry value={currentHydraAPIDoc}
          onSubmit={this.handleIRISubmit} />
        <p>
          {lastUpdated &&
            <span>
              API Doc Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        <div>
          {isEmpty
            ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
            : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                <hr />
                <HydraFrame frameId="main" apiDoc={apiDoc} defaultIri={entryPoint} />
              </div>
          }
        </div>
      </div>)
  }
}

const mapStateToProps = state => {
  const { currentHydraAPIDoc, hydraAPIDoc, entryPoint } = state
  const {
    isFetching,
    lastUpdated,
    content: apiDoc
  } = hydraAPIDoc.content ? hydraAPIDoc : {
    isFetching: true,
    content: {}
  }

  return {
    entryPoint,
    currentHydraAPIDoc,
    apiDoc,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(HydraApp)
