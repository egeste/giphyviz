import qs from 'qs'
import fetch from 'isomorphic-fetch'
import debounce from 'lodash/debounce'

import { scaleLinear, scaleQuantize } from 'd3-scale'

import React, { PureComponent } from 'react'

import {
  Form,
  Image,
  Navbar,
  Spinner,
  Container,
  InputGroup
} from 'react-bootstrap'

import Cube from './components/Cube'
import AudioVisualiser from './components/AudioVisualiser'

import './App.css'

const DEFAULT_FILTER = {
  api_key: 'jjIUQzslADPjJkPXJdmHrkqvGER7KVwV'
}

const frequencyZoomScalar = scaleLinear()
  .domain([ 0, 255 ])
  .range([ 5, -2 ])

export default class App extends PureComponent {

  state = {
    gifs: [],
    term: 'acid',
    count: 20,
    // averages: [],
    loadingMusic: false,
    loadingVideos: false,
    searchingGiphy: false,
    differenceIndex: []
  }

  componentDidMount = () => {
    this.onSearchGiphy()
  }

  onChangeSearch = ({ target }) => {
    this.setState({ term: target.value }, this.onSearchGiphy)
  }

  onSearchGiphy = debounce(() => {
    this.setState({ searchingGiphy: true })
    const filter = { q: this.state.term, ...DEFAULT_FILTER }
    return fetch(`https://api.giphy.com/v1/gifs/search?${qs.stringify(filter)}`)
      .then(response => response.json())
      .then(({ data }) => this.setState({ gifs: data, searchingGiphy: false }, this.onPreloadVideos))
      .catch(() => this.setState({ searchingGiphy: false }))
  }, 1000)

  onPreloadVideos = () => {
    this.setState({ loadingVideos: true })
    return Promise.all(this.state.gifs.map(gif => {
      return new Promise((resolve, reject) => {
        const image = new window.Image()
        image.src = `${gif.images.original.url}`
        image.onload = () => resolve()
        image.onerror = () => reject()
      })
    })).then(() => this.setState({ loadingVideos: false }))
    .catch(() => this.setState({ loadingVideos: false }))
  }

  renderFrequencyData = freqs => {
    if (!this.state.gifs.length) return null
    if (this.state.searchingGiphy) return null
    if (this.state.loadingVideos) return null

    const averageAmplitude = freqs.reduce(((memo, freq) => memo + freq), 0) / freqs.length
    const amplitudeGif = scaleQuantize().domain([0,255]).range(this.state.gifs)(averageAmplitude)
    console.log(amplitudeGif.images)

    const zoom = frequencyZoomScalar(averageAmplitude)
    return (
      <Container style={ { position: 'relative' } }>
        <img src={ `${amplitudeGif.images.original.url}` } style={ {
          position: 'absolute',
          width: '100%',
          height: '60vh',
          zIndex: -1,
          objectFit: 'fill'
        } } />
      </Container>
    )
  }

  render() {
    return (
      <div>

        <Navbar bg="dark" variant="dark" expand="sm">
          <Navbar.Brand to="/" children="giphyviz" />
          <Navbar.Toggle />
          <Form inline>
            <InputGroup className="mb-3">
              <Form.Control type="text"
                value={ this.state.term }
                placeholder="Search"
                onChange={ this.onChangeSearch }
              />
              { this.state.searchingGiphy ? (
                <InputGroup.Append>
                  <InputGroup.Text>
                    <Spinner animation="border" size="sm" />
                  </InputGroup.Text>
                </InputGroup.Append>
              ) : (
                <InputGroup.Append>

                </InputGroup.Append>
              ) }
            </InputGroup>
          </Form>
        </Navbar>

        <AudioVisualiser src="/audio/thriller.mp3"
          renderFrequencyData={ this.renderFrequencyData }
        />

        { this.state.searchingGiphy ? (
          <div style={ { textAlign: 'center' } }>
            <Spinner animation="grow" />
            <p children="Searching giphy..." />
          </div>
        ) : this.state.loadingVideos ? (
          <div style={ { textAlign: 'center' } }>
            <Spinner animation="grow" />
            <p children="Loading giphy results..." />
          </div>
        ) : null }

      </div>
    )
  }

}
