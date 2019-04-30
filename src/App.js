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
    mp3: 'https://cf-media.sndcdn.com/nPYUVOW2Guoe?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vblBZVVZPVzJHdW9lIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTU2NTg5Nzc5fX19XX0_&Signature=gWq7ZKOur0JOsiK1iVS~RtNTDOLuV1lWnC1kp8G4mfSiVBMH0RZvVdOexu0WqfQ15nZcTI2xRTgYz50cRts3BW-Dtzvgk3LAIT1QIorFMRDMegAkfvKQfImPJiA5~Am~yIZgeXcsBtNstersRWAdj3-9Y01lCV7Z~ul50OxzlRoOrmmAK9MuImHe-jXVNCbUKKOK8OfsgZHAXHJStREC~TjAYGD-wPY5kFX9DCbATP-gsjcPUdLhKp8sM4qVkdTpY51ANGdAYz9V5aBOmaccS9v6sKvXE5RbEMRyL~L2sAY0~fDBXOTrmJC~q6B0T6OSmwaDP70QYktUY-zszK~YbQ__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ',
    gifs: [],
    term: 'acid',
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

        <AudioVisualiser src={ this.state.mp3 }
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
