import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.nn = new NeuralNetwork(this.canvas.current, {
      cameraDistance: 200,
      distanceBetweenLayers: 15
    })

    this.nn.addLayer(new ConvLayer({
      depth: 3,
      width: 8,
      height: 8
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 3,
      width: 3,
      height: 3,
      filterDepth: 4,
      stride: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 6,
      height: 6,
      depth: 4,
    }))

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
