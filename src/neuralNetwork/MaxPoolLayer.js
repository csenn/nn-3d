import * as BABYLON from 'babylonjs';
import Layer from './Layer'
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class MaxPoolayer extends Layer {
    constructor (config) {
        super()
        this.width = config.width
        this.height = config.height
        this.depth = config.depth
    }

    build () {
        const { depth, width, height } = this

        const blue = new BABYLON.Color3(0,0,1)    
        const multi = getGridMaterial({
            scene: this.nn.scene,
            depth, 
            width, 
            height,
            lineColor: blue
        })

        const box = BABYLON.MeshBuilder.CreateBox('box', { width, height, depth }, this.nn.scene)
        box.setPositionWithLocalVector(new BABYLON.Vector3(0, 0, this.startDepthPosition + depth/2));
        
        addBoxMeshes(box)
        box.material = multi
    }
}