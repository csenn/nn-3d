import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './App.css';
// import ConvLayer from '../neuralNetwork/ConvLayer';
// import FilterLayer from '../neuralNetwork/FilterLayer'
import BasicConvolution from '../networks/BasicConvolution'
import DepthwiseConvolution from '../networks/DepthwiseConvolution'
import AlexNet from '../networks/AlexNet'
import VGG16 from '../networks/VGG16'
import Padding from '../networks/Padding'
import Stride from '../networks/Stride'
import OneByOne from '../networks/OneByOne'
import Inception from '../networks/Inception';
import Googlenet from '../networks/Googlenet';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
    this.state = {
      SelectedComponent: BasicConvolution
    }
  }

  openStanard = () => this.setState({ SelectedComponent: BasicConvolution })
  openPadding = () => this.setState({ SelectedComponent: Padding })
  openOneByOne = () =>  this.setState({ SelectedComponent: OneByOne })
  openStride = () => this.setState({ SelectedComponent: Stride })
  openDepthwise = () => this.setState({ SelectedComponent: DepthwiseConvolution })
  openInception = () => this.setState({ SelectedComponent: Inception })
  openAlexNet = () => this.setState({ SelectedComponent: AlexNet })
  openVGG = () => this.setState({ SelectedComponent: VGG16 })
  openGooglenet = () => this.setState({ SelectedComponent: Googlenet })

  render () {
    const { SelectedComponent } = this.state

    return (
      <div className="app">
        <div className="sidebar">
          <button onClick={this.openStanard}>
            Standard Convoution
          </button>
          
          <div>
            <button onClick={this.openPadding}>
              Padding
            </button>
          </div>

          <div>
            <button onClick={this.openStride}>
              Stride
            </button>
          </div>

          <div>
            <button onClick={this.openOneByOne}>
              1x1 Conv
            </button>
          </div>

          <div>
            <button onClick={this.openDepthwise}>
              Depthwise Convolution
            </button>
          </div>
          
          <div>
            <button onClick={this.openInception}>
              Inception Layer
            </button>
          </div>


          <div>
            <button onClick={this.openAlexNet}>
              AlexNet
            </button>
          </div>

          <div>
            <button onClick={this.openVGG}>
              VGG16
            </button>
          </div>

          <div>
            <button onClick={this.openGooglenet}>
            Googlenet
            </button>
          </div>
          
        </div>

        <SelectedComponent />

      </div>
      )
  }
}

export default App;
