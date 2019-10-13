import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'
import MaxPoolLayer from '../neuralNetwork/MaxPoolLayer'

export default class Googlenet extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.nn = new NeuralNetwork(this.canvas.current, {
      cameraDistance: 500,
      distanceBetweenLayers: 15,
      cameraSpeed: 10
    })

    this.nn.addLayer(new ConvLayer({ width: 224, height: 224, depth: 3 }))
    this.nn.addLayer(new FilterLayer({ width: 7, height: 7, depth: 7, filterDepth: 64, stride: 2 }))
    this.nn.addLayer(new ConvLayer({ width: 112, height: 112, depth: 64 }))
    this.nn.addLayer(new MaxPoolLayer({ width: 3, height: 3, depth: 1, stride: 2 }))
    this.nn.addLayer(new ConvLayer({ width: 56, height: 56, depth: 64  }))
    this.nn.addLayer(new FilterLayer({ width: 3, height: 3, depth: 64, filterDepth: 192 }))
    this.nn.addLayer(new ConvLayer({ width: 56, height: 56, depth: 192  }))
    this.nn.addLayer(new MaxPoolLayer({ width: 3, height: 3, depth: 1, stride: 2 }))
    this.nn.addLayer(new ConvLayer({ width: 28, height: 28, depth: 192  }))

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