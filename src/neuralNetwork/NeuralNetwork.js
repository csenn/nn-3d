import * as BABYLON from 'babylonjs';

export class NeuralNetwork {
    layers = []
    currentIndex = 0
    currentPosition = 0

    constructor(canvas, opts) {
        this.canvas = canvas
        this.cameraDistance = opts.cameraDistance || 300
        this.distanceBetweenLayers = opts.distanceBetweenLayers || 30
        this.cameraSpeed = opts.cameraSpeed || 2
        this._setup()
    }

    build () {
        window.addEventListener("resize", this._windowResize);

        this.layers.forEach(layer => layer.build())
        this.engine.runRenderLoop(() => this.scene.render());
    }

    dispose() {
        window.removeEventListener("resize", this._windowResize);
        this.engine.dispose()
    }

    addLayer(layer) {
        layer.setNN(this)
        layer.setStartPosition(this.currentPosition)
        layer.setLayerIndex(this.currentIndex)
        this.currentIndex += 1
        this.currentPosition += this.distanceBetweenLayers + layer.getDepth()
        this.layers.push(layer)
    }

    getLayerAtIndex (index) {
        return this.layers[index]
    }

    animate () {
        this.layers.forEach(layer => layer.animate())
    }

    _windowResize = () => {
        this.engine.resize();
    }

    _setup () {
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        // var camera = new BABYLON.ArcRotateCamera(
        //     "Camera", 
        //     0, 
        //     Math.PI / 2, 
        //     2000, 
        //     new BABYLON.Vector3(0,0,0), 
        //     scene
        // );

        var camera = new BABYLON.UniversalCamera(
            "UniversalCamera", 
            new BABYLON.Vector3(this.cameraDistance, 0, 0), 
            this.scene
        );

        camera.speed = this.cameraSpeed
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this.canvas, true);

        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this.scene);
    }
}