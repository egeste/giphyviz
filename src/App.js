import qs from 'qs'
import fetch from 'isomorphic-fetch'
import debounce from 'lodash/debounce'

import { scaleLinear, scaleQuantize } from 'd3-scale'

import React, { PureComponent, Fragment } from 'react'

import {
  Card,
  Form,
  Navbar,
  Spinner,
  InputGroup,
  Container, Row, Col
} from 'react-bootstrap'

import Cube from './components/Cube'
import AudioVisualiser from './components/AudioVisualiser'

import './App.css'

const DEFAULT_FILTER = {
  api_key: 'jjIUQzslADPjJkPXJdmHrkqvGER7KVwV'
}

const frequencyZoomScalar = scaleLinear()
  .domain([ 0, 255 ])
  .range([ 5, 0 ])

export default class App extends PureComponent {

  state = {
    mp3: 'http://51.15.76.3:80/pulstranceHD.mp3',
    gifs: [],
    term: 'acid',
    gifCount: 50,
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

  onChangeMP3 = debounce(({ target }) => {
    this.setState({ mp3: target.value })
  }, 1000)

  onSearchGiphy = debounce(() => {
    this.setState({ searchingGiphy: true })
    const filter = { ...DEFAULT_FILTER, q: this.state.term, limit: this.state.gifCount }
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
    if (this.state.searchingGiphy) return null
    if (this.state.loadingVideos) return null
    if (!this.state.gifs.length) return null

    const averageAmplitude = freqs.reduce(((memo, freq) => memo + freq), 0) / freqs.length
    const highestAmplitudeIndex = freqs.indexOf(([ ...freqs ].sort()[0]))

    console.log(highestAmplitudeIndex)

    const amplitudeGif = scaleQuantize().domain([ 0, freqs.length ]).range(this.state.gifs)(highestAmplitudeIndex)
    const zoom = frequencyZoomScalar(averageAmplitude)
    return (
      <div style={ { position: 'relative' } }>
        <img src={ `${amplitudeGif.images.original.url}` }
          style={ { position: 'absolute', width: '100%', height: '60vh', zIndex: -1, objectFit: 'fill' } }
        />
        {/*
        <Cube zoom={ zoom } style={ { width: '100%', height: '60vh' } } />
        */}
      </div>
    )
  }

  render() {
    return (
      <Fragment>

        <Navbar bg="dark" variant="dark" expand="sm">
          <Navbar.Brand to="/" children="giphyviz" />
          <Navbar.Toggle />
        </Navbar>

        <Container>
          <Row>
            <Col xs={ 3 }>
              <Card>
                <Card.Body>
                  <Form>

                    <Form.Group>
                      <Form.Label children="Audio Source" />
                      <Form.Control type="text"
                        value={ this.state.mp3 }
                        placeholder="http://someurl.com/file.mp3"
                        onChange={ this.onChangeMP3 }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label children="Giphy Search Term" />
                      <InputGroup>
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
                        ) : null }
                      </InputGroup>
                    </Form.Group>

                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={ 9 }>
              <AudioVisualiser autoPlay
                src={ this.state.mp3 }
                style={ { width: '100%' } }
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
                  <p children={ `Loading ${this.state.gifCount} giphy results...` } />
                </div>
              ) : null }
            </Col>
          </Row>
        </Container>

      </Fragment>
    )
  }

}
