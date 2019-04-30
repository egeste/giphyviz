import qs from 'qs'
import fetch from 'isomorphic-fetch'
import chunk from 'lodash/chunk'
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

import {
  VerticalBarSeries,
  FlexibleXYPlot
} from 'react-vis'

import Slider from 'rc-slider'

import Cube from './components/Cube'
import AudioVisualiser from './components/AudioVisualiser'

import './App.css'
import 'rc-slider/assets/index.css'

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
    freqs: [],
    gifCount: 20,
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

  onChangeGifCount = gifCount => {
    this.setState({ gifCount }, this.onSearchGiphy)
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
    const shouldRenderVisualization = (
      !this.state.searchingGiphy &&
      !this.state.loadingVideos &&
      this.state.gifs.length
    )

    const chunkedFreqs = chunk(freqs, 10).reduce((memo, freqsChunk) => {
      const chunkAverage = freqsChunk.reduce(((memo, freq) => memo + freq), 0)
      return [ ...memo, chunkAverage ]
    }, [])

    const averageAmplitude = chunkedFreqs.reduce(((memo, freq) => memo + freq), 0) / chunkedFreqs.length
    const highestAmplitude = [ ...chunkedFreqs ].sort().reverse()[0]
    const highestAmplitudeIndex = chunkedFreqs.indexOf(highestAmplitude)
    console.log({ highestAmplitude, highestAmplitudeIndex })

    const data = chunkedFreqs.map((freq, index) => ({
      x: index,
      y: freq,
      colorType: 'literal',
      color: (index === highestAmplitudeIndex) ? 'green' : 'purple'
    }))

    return (
      <div style={ { position: 'relative' } }>
        <FlexibleXYPlot height={ 100 }>
          <VerticalBarSeries colorType="literal" data={ data } />
        </FlexibleXYPlot>
        { shouldRenderVisualization ? (() => {
          // const zoom = frequencyZoomScalar(averageAmplitude)
          const amplitudeGif = scaleQuantize()
            .domain([ 0, chunkedFreqs.length ])
            .range(this.state.gifs)(highestAmplitudeIndex)

          return (
            <Fragment>
              <img src={ `${amplitudeGif.images.original.url}` }
                style={ { position: 'absolute', width: '100%', height: '60vh', zIndex: -1, objectFit: 'fill' } }
              />
              { /*
              <Cube zoom={ zoom } style={ { width: '100%', height: '60vh' } } />
              */ }
            </Fragment>
          )
        })() : null }
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
                  <Form.Group>
                    <Form.Label children="Number of gifs" />
                    <InputGroup>
                      <Slider defaultValue={ this.state.gifCount }
                        onChange={ this.onChangeGifCount }
                      />
                    </InputGroup>
                  </Form.Group>
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
