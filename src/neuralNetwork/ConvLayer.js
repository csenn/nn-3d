import * as BABYLON from 'babylonjs';
import Layer from './Layer'
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class ConvLayer extends Layer {
    constructor (config) {
        super()
        this.width = config.width
        this.height = config.height
        this.depth = config.depth
        this.opaque = !!config.opaque
    }

    build () {
        const { depth, width, height } = this
        const { scene } = this.nn

        const multi = getGridMaterial({
            scene,
            depth, 
            width, 
            height,
            opaque: this.opaque,
            // lineColor: new BABYLON.Color3(0,0,0), 
            lineColor: new BABYLON.Color3(0,0,0), 

            mainColor: new BABYLON.Color3(.85,.85,.85)
        })
            
        const box = BABYLON.MeshBuilder.CreateBox('box', { width, height, depth }, scene)
        box.setPositionWithLocalVector(new BABYLON.Vector3(0, 0, this.startDepthPosition + depth/2));
        
        addBoxMeshes(box)
        box.material = multi
    }
}
