import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  fetchDocForFrameIfNeeded,
  invalidateFrame, changeIRIForFrame
} from '../actions'
// import { 
//   changeHydraDoc, fetchHydraDocIfNeeded, 
//   invalidateHydraDoc, fetchHydraAPIDocIfNeeded,
//   fetchDocForFrameIfNeeded,
//   invalidateFrame, changeIRIForFrame
// } from '../actions'
import IRIEntry from '../components/IRIEntry'
import HydraDoc from '../components/HydraDoc'
import HydraCollection from '../components/HydraCollection'
import { findSupportedClass, isSubClassOf } from '../hydra/apidoc'
import { HydraNamespace } from '../namespaces/Hydra'

import { typesContainAny } from '../jsonld/helper'

// Testing for redux-form
import showResults from './showResults'
import InitializeFromStateForm from './InitializeFromStateForm'
import HydraForm from './HydraForm'
// import { findSupportedClass } from '../hydra/apidoc'


class HydraFrame extends Component {
  static propTypes = {
    frameId: PropTypes.string.isRequired,
    iri: PropTypes.string.isRequired,
    // currentHydraDoc: PropTypes.string.isRequired,
    // currentHydraAPIDoc: PropTypes.string.isRequired,
    apiDoc: PropTypes.object.isRequired,
    apiDocClass: PropTypes.object,
    hydraDoc: PropTypes.object, // .isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, frameId, iri } = this.props
    // const { dispatch, currentHydraDoc, currentHydraAPIDoc } = this.props
    // dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
    // dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
    dispatch(fetchDocForFrameIfNeeded(frameId, iri))
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps()", nextProps.iri, this.props.iri)
    if (nextProps.iri !== this.props.iri) {
      console.log("Different Hydra Doc requested")
      const { dispatch, frameId, iri } = nextProps
      dispatch(invalidateFrame(frameId))
      dispatch(fetchDocForFrameIfNeeded(frameId, iri))
    }
    // if (nextProps.currentHydraDoc !== this.props.currentHydraDoc) {
    //   console.log("Different Hydra Doc requested")
    //   const { dispatch, currentHydraDoc } = nextProps
    //   dispatch(invalidateHydraDoc(currentHydraDoc))
    //   dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
    // }
  }

  handleIRISubmit = nextIri => {
    const { dispatch, frameId } = this.props
    dispatch(changeIRIForFrame(frameId, nextIri))
    // this.props.dispatch(changeHydraDoc(nextIri))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, frameId, iri } = this.props
    dispatch(invalidateFrame(frameId))
    dispatch(fetchDocForFrameIfNeeded(frameId, iri))

    // const { dispatch, currentHydraDoc } = this.props
    // dispatch(invalidateHydraDoc(currentHydraDoc))
    // dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
  }

  handleHomeClick = e => {
    e.preventDefault()

    const { dispatch, frameId, defaultIri } = this.props
    dispatch(changeIRIForFrame(frameId, defaultIri))
  }

  // findAPIDocSupportedClass () {
  //   const { hydraDoc, apiDoc } = this.props
  //   console.log("APIDoc:")
  //   console.log("TODO: find out why API doc object is under apiDoc key")
  //   console.log(apiDoc.apiDoc)
  //   return findSupportedClass (apiDoc.apiDoc, hydraDoc['@type'])
  // }

  isHydraDocEmpty() {
    const { hydraDoc } = this.props
    return hydraDoc == null || Object.keys(hydraDoc).length === 0
  }

  isCollection() {
    // Finds out whether the Hydra doc contains a collection
    const { hydraDoc, apiDocClass } = this.props
    const hydraCollectionIRIs = [HydraNamespace.Collection, HydraNamespace.PagedCollection]

    if (this.isHydraDocEmpty()) {
      return false;
    }

    // Check if Hydra doc is a collection or if it's sub class of collection
    return typesContainAny(hydraDoc["@type"], hydraCollectionIRIs) ||
      isSubClassOf(apiDocClass, hydraCollectionIRIs)
  }

  render() {
    const { iri, isFetching, lastUpdated, hydraDoc, frameId, apiDocClass, apiDoc, defaultIri } = this.props
    const isEmpty = this.isHydraDocEmpty()
    const isCollectn = this.isCollection()

    // TEMP testing redux form
    // const expectedClass = findSupportedClass(apiDoc, {'@id': 'http://localhost:8080/hydra/entrypoint'})
    const expectedClass = findSupportedClass(apiDoc, 'http://localhost:8080/hydra/api-doc#DatasetSummary')
    // END TEMP

    return (
      <div>
        <div><a href="#" onClick={this.handleHomeClick}>Home</a> ({frameId} frame)</div>
        <IRIEntry value={iri}
          onSubmit={this.handleIRISubmit} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
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
                {isCollectn
                  ? <HydraCollection hydraDoc={hydraDoc} supportedClass={apiDocClass} apiDoc={apiDoc} frameId={frameId} />
                  : <HydraDoc hydraDoc={hydraDoc} supportedClass={apiDocClass} frameId={frameId} />
                }
              </div>
          }
        </div>
        <HydraForm onSubmit={showResults} expectedClass={expectedClass} />
        <InitializeFromStateForm onSubmit={showResults} />
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { frameId, defaultIri } = ownProps
  const { hydraDocByFrameId, currentIRIForFrame } = state

  const {
    isFetching,
    lastUpdated,
    content: hydraDoc
  } = hydraDocByFrameId[frameId] || {
    isFetching: true,
    content: null
  }
  const iri = currentIRIForFrame[frameId] || defaultIri
  const apiDocClass = hydraDoc ? findSupportedClass(ownProps.apiDoc, hydraDoc['@type']) : null

  return {
    iri,
    hydraDoc,
    apiDocClass,
    isFetching,
    lastUpdated,
    defaultIri
  }
}

export default connect(mapStateToProps)(HydraFrame)
