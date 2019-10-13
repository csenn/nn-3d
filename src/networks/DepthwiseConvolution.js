import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'
import DepthwiseConvLayer from '../neuralNetwork/DepthwiseConvLayer'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.nn = new NeuralNetwork(this.canvas.current, {
      cameraDistance: 75,
      distanceBetweenLayers: 5
    })

    this.nn.addLayer(new ConvLayer({ width: 12, height: 12, depth: 3, opaque: true }))
    this.nn.addLayer(new DepthwiseConvLayer({ width: 5, height: 5, depth: 1, filterDepth: 3 }))
    this.nn.addLayer(new ConvLayer({ width: 8, height: 8, depth: 3, opaque: true }))
    this.nn.addLayer(new FilterLayer({ width: 1, height: 1, depth: 3, filterDepth: 20 }))
    this.nn.addLayer(new ConvLayer({ width: 8, height: 8, depth: 20, opaque: true }))

    this.nn.build()
    this.nn.animate()
  }

  componentWillUnmount() {
    this.nn.dispose()
  }

  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas 
          className="render-canvas"
          ref={this.canvas}
          touch-action="none">
        </canvas> 
      </div>
    )
  }
}

export default App;
