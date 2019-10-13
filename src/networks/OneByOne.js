import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './network.css';
import ConvLayer from '../neuralNetwork/ConvLayer';
import FilterLayer from '../neuralNetwork/FilterLayer'

// https://medium.com/coinmonks/paper-review-of-googlenet-inception-v1-winner-of-ilsvlc-2014-image-classification-c2b3565a64e7
export default class OneByOne extends React.Component {

  constructor(props) {
    super(props)
    this.canvasTop = React.createRef();
    this.canvasBottom = React.createRef();
  }

  componentDidMount() {
    this.buildTopNetwork() 
    this.buildBottomNetwork()
  }

  buildTopNetwork = () => {
    this.nnTop = new NeuralNetwork(this.canvasTop.current, {
      cameraDistance: 1000,
      distanceBetweenLayers: 10,
      cameraSpeed: 15
    })

    this.nnTop.addLayer(new ConvLayer({ width: 14, height: 14, depth: 480 }))
    this.nnTop.addLayer(new FilterLayer({ width: 5, height: 5, depth: 480, filterDepth: 48 }))
    this.nnTop.addLayer(new ConvLayer({  width: 14, height: 14, depth: 48 }))
    this.nnTop.build()
    this.nnTop.calculate()
  }

  buildBottomNetwork = () => {
    this.nnBottom = new NeuralNetwork(this.canvasBottom.current, {
      cameraDistance: 1000,
      distanceBetweenLayers: 10,
      cameraSpeed: 15
    })

    this.nnBottom.addLayer(new ConvLayer({ width: 14, height: 14, depth: 480 }))
    this.nnBottom.addLayer(new FilterLayer({ width: 1, height: 1, depth: 480, filterDepth: 16 }))
    this.nnBottom.addLayer(new ConvLayer({ width: 14, height: 14, depth: 16 }))
    this.nnBottom.addLayer(new FilterLayer({ width: 5, height: 5, depth: 16, filterDepth: 48 }))
    this.nnBottom.addLayer(new ConvLayer({ width: 14, height: 14, depth: 48 }))
    this.nnBottom.build()
    this.nnBottom.calculate()
  }

  componentWillUnmount() {
    this.nnTop.dispose()
    this.nnBottom.dispose()
  }

  render () {
    return (
      <React.Fragment>
        <div className='top-canvas-wrapper'>
          <canvas 
            className="render-canvas"
            ref={this.canvasTop}
            touch-action="none">
          </canvas> 
        </div>

        <div className='bottom-canvas-wrapper'>
          <canvas 
            className="render-canvas"
            ref={this.canvasBottom}
            touch-action="none">
          </canvas> 
        </div>

      </React.Fragment>
    )
  }
}