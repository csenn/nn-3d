import React from 'react';
import { NeuralNetwork } from '../neuralNetwork/NeuralNetwork'
import './App.css';
// import ConvLayer from '../neuralNetwork/ConvLayer';
// import FilterLayer from '../neuralNetwork/FilterLayer'
import BasicConvolution from '../networks/BasicConvolution'
import AlexNet from '../networks/AlexNet'


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

  openAlexNet = () => {
    this.setState({ SelectedComponent: AlexNet })
  }

  render () {
    const { SelectedComponent } = this.state

    return (
      <div className="app">
        <div className="sidebar">
          <button onClick={this.openStanard}>
            Standard Convoution
          </button>

          <button onClick={this.openAlexNet}>
            AlexNet
          </button>
        </div>

        <SelectedComponent />

      </div>
      )
  }
}

export default App;
