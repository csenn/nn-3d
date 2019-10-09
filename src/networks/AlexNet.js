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
      cameraDistance: 1000,
      distanceBetweenLayers: 30,
      cameraSpeed: 20
    })

    this.nn.addLayer(new ConvLayer({
      depth: 3,
      width: 240,
      height: 240
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 3,
      width: 11,
      height: 11,
      filterDepth: 96,
      stride: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 240,
      height: 240,
      depth: 96,
    }))

    this.nn.addLayer(new ConvLayer({
      width: 120,
      height: 120,
      depth: 96,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 96,
      width: 5,
      height: 5,
      filterDepth: 256,
      stride: 1
    }))
  
    this.nn.addLayer(new ConvLayer({
      width: 120,
      height: 120,
      depth: 256,
    }))


    this.nn.build()
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
