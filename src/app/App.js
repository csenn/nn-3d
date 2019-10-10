import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './App.css';
// import ConvLayer from '../neuralNetwork/ConvLayer';
// import FilterLayer from '../neuralNetwork/FilterLayer'
import BasicConvolution from '../networks/BasicConvolution'
import AlexNet from '../networks/AlexNet'
import VGG16 from '../networks/VGG16'
import Padding from '../networks/Padding'
import Stride from '../networks/Stride'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.canvas = React.createRef();
    this.state = {
      SelectedComponent: BasicConvolution
    }
  }

  openStanard = () => {
    this.setState({ SelectedComponent: BasicConvolution })
  }

  openPadding = () => {
    this.setState({ SelectedComponent: Padding })
  }

  openStride = () => {
    this.setState({ SelectedComponent: Stride })

  }

  openAlexNet = () => {
    this.setState({ SelectedComponent: AlexNet })
  }

  openVGG = () => {
    this.setState({ SelectedComponent: VGG16 })
  }

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
            <button onClick={this.openAlexNet}>
              AlexNet
            </button>
          </div>

          <div>
            <button onClick={this.openVGG}>
              VGG16
            </button>
          </div>

        </div>

        <SelectedComponent />

      </div>
      )
  }
}

export default App;
