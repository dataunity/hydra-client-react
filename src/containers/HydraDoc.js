import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HydraProperties from '../containers/HydraProperties'
import { getLabel } from '../jsonld/helper'

// Testing for redux-form
import showResults from './showResults'
import HydraForm from './HydraForm'

class HydraDoc extends Component {

	render() {
		const { hydraDoc, supportedClass, frameId, formMethod, formUrl, formExpectedClass } = this.props
		const showFormView = Boolean(formMethod)
		return (
			<div>
				<h2>{getLabel(supportedClass)}</h2>
				{showFormView
					? <HydraForm form={'form-' + frameId} 
						onSubmit={showResults}
						formMethod={formMethod} 
						formUrl={formUrl} 
						expectedClass={formExpectedClass} />
					: <HydraProperties 
						hydraDoc={hydraDoc} 
						supportedClass={supportedClass}
						frameId={frameId} />
				}
			</div>
		)
	}
}

HydraDoc.propTypes = {
	hydraDoc: PropTypes.object.isRequired,
	supportedClass: PropTypes.object,
	frameId: PropTypes.string.isRequired,
	formMethod: PropTypes.string,
	formUrl: PropTypes.string,
	formExpectedClass: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const { formByFrameId } = state
  const { frameId } = ownProps
  const {
    method: formMethod,
    formUrl,
    expectedClass: formExpectedClass
  } = formByFrameId[frameId] || {
    method: "",
    formUrl: "",
    expectedClass: null
  }

  return {
    formMethod,
    formUrl,
    formExpectedClass
  }
}

export default connect(mapStateToProps)(HydraDoc)