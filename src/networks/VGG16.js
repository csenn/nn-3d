import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'
import MaxPoolLayer from '../neuralNetwork/MaxPoolLayer'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.nn = new NeuralNetwork(this.canvas.current, {
      cameraDistance: 5000,
      distanceBetweenLayers: 30,
      cameraSpeed: 20
    })

    this.nn.addLayer(new ConvLayer({
      depth: 3,
      width: 224,
      height: 224
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 3,
      width: 3,
      height: 3,
      filterDepth: 64,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 224,
      height: 224,
      depth: 64,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 64,
      width: 3,
      height: 3,
      filterDepth: 64,
      stride: 1,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 224,
      height: 224,
      depth: 64,
    }))

    this.nn.addLayer(new MaxPoolLayer({
      width: 2,
      height: 2,
      depth: 1,
      stride: 2
    }))

    this.nn.addLayer(new ConvLayer({
      width: 112,
      height: 112,
      depth: 64,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 64,
      width: 3,
      height: 3,
      filterDepth: 128,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 112,
      height: 112,
      depth: 128,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 128,
      width: 3,
      height: 3,
      filterDepth: 128,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 112,
      height: 112,
      depth: 128,
    }))

    // Max Pool
    this.nn.addLayer(new MaxPoolLayer({
      width: 2,
      height: 2,
      depth: 1,
      stride: 2
    }))

    this.nn.addLayer(new ConvLayer({
      width: 56,
      height: 56,
      depth: 128,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 128,
      width: 3,
      height: 3,
      filterDepth: 256,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 56,
      height: 56,
      depth: 256,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 256,
      width: 3,
      height: 3,
      filterDepth: 256,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 56,
      height: 56,
      depth: 256,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 256,
      width: 3,
      height: 3,
      filterDepth: 256,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 56,
      height: 56,
      depth: 256,
    }))

    // max pool
    this.nn.addLayer(new MaxPoolLayer({
      width: 2,
      height: 2,
      depth: 1,
      stride: 2
    }))

    this.nn.addLayer(new ConvLayer({
      width: 28,
      height: 28,
      depth: 256,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 256,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 28,
      height: 28,
      depth: 512,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 512,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 28,
      height: 28,
      depth: 512,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 512,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 28,
      height: 28,
      depth: 512,
    }))

    // Max Pool
    this.nn.addLayer(new MaxPoolLayer({
      width: 2,
      height: 2,
      depth: 1,
      stride: 2
    }))

    this.nn.addLayer(new ConvLayer({
      width: 14,
      height: 14,
      depth: 512,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 512,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 14,
      height: 14,
      depth: 512,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 512,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 14,
      height: 14,
      depth: 512,
    }))

    this.nn.addLayer(new FilterLayer({
      depth: 512,
      width: 3,
      height: 3,
      filterDepth: 512,
      padding: 1
    }))

    this.nn.addLayer(new ConvLayer({
      width: 14,
      height: 14,
      depth: 512,
    }))

    this.nn.build()

    this.nn.calculate()

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
