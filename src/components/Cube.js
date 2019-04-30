import omit from 'lodash/omit'
import * as THREE from 'three'

import React, { PureComponent } from 'react'


export default class Scene extends PureComponent {

  state = {}

  componentDidMount = () => {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, (width / height), 0.1, 1000)
    this.camera.position.z = 4

    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: 'purple' })
    this.cube = new THREE.Mesh(this.geometry, this.material)

    this.scene = new THREE.Scene()
    this.scene.add(this.cube)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(width, height)

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount = () => {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
    this.cube.rotation.z += 0.01
    this.camera.position.z = this.props.zoom

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  onRef = mount => this.mount = mount

  render() {
    return (
      <div { ...omit(this.props, 'zoom') } ref={ this.onRef } />
    )
  }
}
