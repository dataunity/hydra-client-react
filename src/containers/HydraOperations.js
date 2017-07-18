import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLabel, getLiteralValue } from '../jsonld/helper'
import { getSupportedOperations } from '../hydra/apidoc'
import { HydraNamespace } from '../namespaces/Hydra'
import { changeIRIForFrame } from '../actions'

class HydraOperations extends Component {

	constructor(props) {
		super(props)

		this.handleGETClick = this.handleGETClick.bind(this)
	}

	getOperations() {
		return getSupportedOperations(this.props.supportedProperty)
	}

	handleIriChange(evt) {
		console.log("Handling GET op", evt)
		// this.props.dispatch(fetchHydraDoc('http://localhost:8080/hydra/entrypoint'))
	}

	handleGETClick(evt) {
		const { frameId, dispatch } = this.props
		evt.preventDefault()
		dispatch(changeIRIForFrame(frameId, evt.target.href))
	}

	createOpElement(op, val, index) {
		let formMethod = getLiteralValue(op, HydraNamespace.method, "")
		if (!val || !val.hasOwnProperty("@id")) {
			throw new Error("Expected property value to be an id link")
		}
		var url = val["@id"]

		switch (formMethod) {
			case "GET":
				return <span key={index}><a onClick={this.handleGETClick} href={url}>{getLabel(op)}</a> (GET)</span>
				// return (
				// 	<div key={i}>
				// 		<span>GET Op {getLabel(op)}</span>
				// 		<span onClick={e => this.handleIriChange(e)}>Click</span>
				// 	</div>)
			case "POST":
				return <span key={index}>POST Op {getLabel(op)}</span>
			default:
				return <span>Unknown Operation</span>
		}
	}

	render() {
		const { val } = this.props
		let ops = this.getOperations()
		return (
			<span>
				{ops.map((op, i) =>
					this.createOpElement(op, val, i)
				)}
			</span>

		)
	}
}

HydraOperations.propTypes = {
	val: PropTypes.object,	// The value of the Hydra Doc property
	supportedProperty: PropTypes.object,
	frameId: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { hydraAPIDoc } = state

	return {
		hydraAPIDoc
	}
}

export default connect(mapStateToProps)(HydraOperations)