import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import AudioAnalyser from './AudioAnalyser'

export default class AudioVisualiser extends PureComponent {

  static propTypes = {
    renderFrequencyData: PropTypes.func.isRequired
  }

  state = { frequencyData: [] }

  onFrequencyData = frequencyData => this.setState({ frequencyData })

  render() {
    return (
      <Fragment>
        <AudioAnalyser { ...this.props } onFrequencyData={ this.onFrequencyData } />
        { this.props.renderFrequencyData([ ...this.state.frequencyData ]) }
      </Fragment>
    )
  }

}
