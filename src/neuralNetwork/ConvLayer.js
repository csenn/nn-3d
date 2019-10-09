import * as BABYLON from 'babylonjs';
import Layer from './Layer'
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class ConvLayer extends Layer {
    constructor (config) {
        super()
        this.width = config.width
        this.height = config.height
        this.depth = config.depth
    }

    build () {
        const { depth, width, height } = this
        const { scene } = this.nn

        const yellow = new BABYLON.Color3(.95,.95,.95)
        const multi = getGridMaterial(scene, { depth, width, height }, yellow, true)
    
        const box = BABYLON.MeshBuilder.CreateBox('box', { width, height, depth }, scene)
        box.setPositionWithLocalVector(new BABYLON.Vector3(0, 0, this.startDepthPosition + depth/2));
        
        addBoxMeshes(box)
        box.material = multi
    }
}
