export default class Layer {
    constructor() {
        this.layerIndex = null
        this.startDepthPosition = 0
    }

    getDepth () {
        return this.depth|| 0
    }

    setStartPosition (depth) {
        this.startDepthPosition = depth
    }

    setLayerIndex (layerIndex) {
        this.layerIndex = layerIndex
    }

    setNN(nn) {
        this.nn = nn
    }

    animate() {
        return console.log('Did Not Animate Layer:', this.layerIndex)
    }
}