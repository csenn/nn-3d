import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'

// https://medium.com/coinmonks/paper-review-of-googlenet-inception-v1-winner-of-ilsvlc-2014-image-classification-c2b3565a64e7
export default class Inception extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.nn = new NeuralNetwork(this.canvas.current, {
      cameraDistance: 1000,
      distanceBetweenLayers: 10,
      cameraSpeed: 15
    })

    this.nn.addLayer(new ConvLayer({ width: 28, height: 28, depth: 192 }))
   
    this.nn.addLayer(new FilterLayer({ width: 1, height: 1, depth: 192, filterDepth: 48 }))
   
   
   
    this.nn.addLayer(new ConvLayer({  width: 14, height: 14, depth: 48 }))
    
    
    
    
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