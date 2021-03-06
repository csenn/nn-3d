import * as BABYLON from 'babylonjs';
import { getGridMaterial, addBoxMeshes  } from './utils'
import Layer from './Layer'

export default class FilterLayer extends Layer {
    animatedFilterBoxes = []
    animatedConvBoxes = []
    isDepthwiseConv = false

    constructor (opts) {
        super()
        this.width = opts.width
        this.height = opts.height
        this.depth = opts.depth
        this.filterDepth = opts.filterDepth
        this.stride = opts.stride || 1
        this.padding = opts.padding || 0
    }

    animate() {
        this._addAnimations()
        this._createAnimatedConvBoxes()
        this._animateFilterBox(0)
        this.animatedConvBoxes.forEach(convBox => this.nn.scene.beginAnimation(convBox, 0, 10000, false))
    }

    build () {
        const { filterDepth, depth, width, height } = this
        const { scene } = this.nn

        const orange = new BABYLON.Color3(1,0.6,0)

        const multi = getGridMaterial({
            scene: this.nn.scene,
            depth, 
            width, 
            height,
            lineColor: orange
        })

        const root = Math.ceil(Math.sqrt(filterDepth))

        for (let i=0; i < root; i++) {
            for (let j=0; j< root; j++) {
                if (j * root + i + 1 > filterDepth) {
                    continue
                }

                const box = BABYLON.MeshBuilder.CreateBox('box', {
                    width: width, 
                    height: height, 
                    depth: depth,
                }, scene)
    
                const BUFFER = 1
    
                const position = new BABYLON.Vector3(
                    - i * (width + BUFFER) + (root/2) * (width + BUFFER) - width / 2, 
                    - j * (height + BUFFER) + (root/2) * (height + BUFFER) - height / 2, 
                    this.startDepthPosition + depth / 2
                )
    
                addBoxMeshes(box)
                box.material = multi
                box.setPositionWithLocalVector(position);

                this.animatedFilterBoxes.push(box)
            }
        }
    }

    _animateFilterBox(filterBoxIndex) {
        if (filterBoxIndex === this.animatedFilterBoxes.length) {
            return
            // return this._animateFilterBox(0)
        }

        const onAnimationEnd = () => this._animateFilterBox(filterBoxIndex + 1)
        const filterBox = this.animatedFilterBoxes[filterBoxIndex]
        this.nn.scene.beginAnimation(filterBox, 0, 10000, false, 1, onAnimationEnd);
    }

    _addAnimations() {
        const prevLayer = this.nn.getLayerAtIndex(this.layerIndex - 1)

        this.animatedFilterBoxes.forEach((box, index) => {
            
            const positionAnimation = new BABYLON.Animation(
                "myAnimation", 
                "position", 
                30, 
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );

            const keys = []
            let x = prevLayer.width / 2 - (this.width / 2) + this.padding
            let y = prevLayer.height / 2 - (this.height / 2) + this.padding
            let z = prevLayer.startDepthPosition + (this.depth / 2) + (this.isDepthwiseConv ? index : 0)
            const startPosition = box.getPositionExpressedInLocalSpace()
           
            keys.push({
                frame: 0,
                value: startPosition
            });

            const TIME_ACROSS = 120
            const FROM_START = 15

            let frame
            const stepsDown = 1 + prevLayer.height - this.height + (2 * this.padding)
            const stepsAcross = 1 + prevLayer.width - this.width + (2 * this.padding)

            for (let i = 0; i < stepsDown; i += this.stride) {
                for (let j = 0; j < stepsAcross; j += this.stride) {
                    
                    frame = FROM_START + TIME_ACROSS * i/this.stride + j * (TIME_ACROSS / stepsAcross)

                    keys.push({
                        frame: frame,
                        value: new BABYLON.Vector3(x - j, y, z)
                    }, {
                        frame: frame + 5,
                        value: new BABYLON.Vector3(x - j, y, z)
                    })
                }
    
                y -= 1 * this.stride
            }
    
            keys.push({
                frame: frame + FROM_START,
                value: startPosition
            })
    
            positionAnimation.setKeys(keys);
            box.animations = [];
            box.animations.push(positionAnimation);   
        })
    }
    _createAnimatedConvBoxes() {
        const nextLayer = this.nn.getLayerAtIndex(this.layerIndex + 1)

        const color = new BABYLON.Color4(1,0.6,0, 0)

        for (let i=0; i<nextLayer.width; i++) {
            for (let j=0; j<nextLayer.height; j++) {
                for (let k =0; k<nextLayer.depth; k++) {

                    const box = BABYLON.MeshBuilder.CreateBox('box', {
                        width: 1,
                        height: 1,
                        depth: 1,
                        // faceColors: [color, color, color, color, color, color]
                    }, this.scene)
                        

                    var materialforbox = new BABYLON.StandardMaterial("texture1", this.scene);
                    materialforbox.diffuseColor = color
                    materialforbox.alpha = 0.7
                    box.material = materialforbox

                    const initialPosition = new BABYLON.Vector3(
                        i - nextLayer.width / 2 + 1/2,
                        j - nextLayer.height / 2 + 1/2,
                        nextLayer.startDepthPosition + k + 1/2  
                    )
            
                    box.setPositionWithLocalVector(initialPosition);
            
                    const animationVisibility = new BABYLON.Animation(
                        "visibilityAnimation", 
                        "visibility", 
                        30, 
                        BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
                        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                    );

                    const TIME_ACROSS = 120
                    const FROM_START = 15
            
                    const frame = FROM_START * (k + 1)
                        + (nextLayer.width - i - 1) * TIME_ACROSS/nextLayer.width
                        + (nextLayer.height - j - 1) * TIME_ACROSS
                        + k * nextLayer.height * TIME_ACROSS

                    animationVisibility.setKeys([
                        {
                            frame: 0,
                            value: 0
                        },
                        {
                            frame: frame,
                            value: 0
                        },
                        {
                            frame: frame + 5,
                            value: 1
                        }
                    ])
            
                    box.animations = [];
                    box.animations.push(animationVisibility);               
                    this.animatedConvBoxes.push(box)
                }
            }
        }       



    // _createAnimatedConvBoxes() {
    //     const nextLayer = this.nn.getLayerAtIndex(this.layerIndex + 1)

    //     const color = new BABYLON.Color4(1,0.6,0, 0.1)

    //     for (let i=0; i<nextLayer.depth; i++) {
    //         for (let j=0; j<nextLayer.height; j++) {

    //             const box = BABYLON.MeshBuilder.CreateBox('box', {
    //                 width: 1,
    //                 height: 1,
    //                 depth: 1,
    //                 faceColors: [color, color, color, color, color, color]
    //             }, this.scene)
        
    //             const yPosition =  nextLayer.height / 2 - (1/2) 
        
    //             const initialPosition = new BABYLON.Vector3(
    //                 nextLayer.width / 2 ,
    //                 yPosition - j,
    //                 nextLayer.startDepthPosition + (1/2) + i
    //             )
        
    //             box.setPositionWithLocalVector(initialPosition);
        
    //             const animationVisibility = new BABYLON.Animation(
    //                 "visibilityAnimation", 
    //                 "visibility", 
    //                 30, 
    //                 BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
    //                 BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    //             );

    //             const animationWidth = new BABYLON.Animation(
    //                 "widthAnimation", 
    //                 "scaling.x", 
    //                 30, 
    //                 BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
    //                 BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    //             );
        
    //             const animationLocation = new BABYLON.Animation(
    //                 "positionAnimation", 
    //                 "position", 
    //                 30, 
    //                 BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
    //                 BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    //             );

    //             const TIME_ACROSS = 120
    //             const FROM_START = 15

    //             const frame = (FROM_START * (i + 1)) + (j * TIME_ACROSS) + (i * nextLayer.height * TIME_ACROSS)
        
    //             animationVisibility.setKeys([
    //                 {
    //                     frame: 0,
    //                     value: 0
    //                 },
    //                 {
    //                     frame: frame,
    //                     value: 0
    //                 },
    //                 {
    //                     frame: frame + 5,
    //                     value: 1
    //                 }
    //             ])

    //             animationWidth.setKeys([
    //                 {
    //                     frame: 0,
    //                     value: 0
    //                 },
    //                 {
    //                     frame: frame,
    //                     value: 0
    //                 },
    //                 {
    //                     frame: frame + TIME_ACROSS,
    //                     value: nextLayer.width
    //                 }
    //             ]);
        
    //             animationLocation.setKeys([
    //                 {
    //                     frame: 0,
    //                     value: initialPosition
    //                 },
    //                 {
    //                     frame: frame,
    //                     value: new BABYLON.Vector3(
    //                         nextLayer.width / 2 ,
    //                         yPosition - j,
    //                         nextLayer.startDepthPosition + (1/2) + i
    //                     )
    //                 },
    //                 {
    //                     frame: frame + TIME_ACROSS,
    //                     value: new BABYLON.Vector3(
    //                         0,
    //                         yPosition - j,
    //                         nextLayer.startDepthPosition + (1/2) + i
    //                     )
    //                 }
    //             ])
        
    //             box.animations = [];
    //             box.animations.push(animationVisibility);
    //             box.animations.push(animationWidth);
    //             box.animations.push(animationLocation);
        
    //             this.animatedConvBoxes.push(box)
    //         }
    //     }       
    }
}
