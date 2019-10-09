import * as BABYLON from 'babylonjs';
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class MaxPoolayer {
    constructor (nn, config, startDepthPosition) {
        this.nn = nn;
        this.scene = nn.scene
        this.config = config
        this.startDepthPosition = startDepthPosition
    }

    getEndPosition () {
        return this.startDepthPosition + this.config.depth
    }

    build () {
        const { depth, width, height } = this.config

        const blue = new BABYLON.Color3(0,0,1)
        const multi = getGridMaterial(this.scene, this.config, blue, false)
    
        const box = BABYLON.MeshBuilder.CreateBox('box', { width, height, depth }, this.scene)
        box.setPositionWithLocalVector(new BABYLON.Vector3(0, 0, this.startDepthPosition + depth/2));
        
        addBoxMeshes(box)
        box.material = multi
    }
}