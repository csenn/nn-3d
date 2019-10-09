import * as BABYLON from 'babylonjs';
import { getGridMaterial, addBoxMeshes  } from './utils'
import Layer from './Layer'

export default class FilterLayer extends Layer {
    animatedFilterBoxes = []
    animatedConvBoxes = []

    constructor (opts) {
        super()
        this.width = opts.width
        this.height = opts.height
        this.depth = opts.depth
        this.filterDepth = opts.filterDepth
        this.stride = opts.stride
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
        const multi = getGridMaterial(scene, { depth, width, height } , orange, false)

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
    
                const BUFFER = 2
    
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
            return this._animateFilterBox(0)
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
            let x = prevLayer.width / 2 - (this.width / 2)
            let y = prevLayer.height / 2 - (this.height / 2)
            let z = prevLayer.startDepthPosition + (this.depth / 2)
            const startPosition = box.getPositionExpressedInLocalSpace()
           
            keys.push({
                frame: 0,
                value: startPosition
            });

            const TIME_ACROSS = 120
            const FROM_START = 15

            let frame
            const stepsDown = 1 + prevLayer.height - this.height
            const stepsAcross = 1 + prevLayer.width - this.width

            for (let i = 0; i < stepsDown; i++) {
                for (let j = 0; j < stepsAcross; j++) {
                    
                    frame = FROM_START + TIME_ACROSS * i + j * (TIME_ACROSS / stepsAcross)

                    keys.push({
                        frame: frame,
                        value: new BABYLON.Vector3(x - j, y, z)
                    }, {
                        frame: frame + 5,
                        value: new BABYLON.Vector3(x - j, y, z)
                    })
                }
    
                y -= 1
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

        const color = new BABYLON.Color3(1,1,0)

        for (let i=0; i<nextLayer.depth; i++) {
            for (let j=0; j<nextLayer.height; j++) {

                const box = BABYLON.MeshBuilder.CreateBox('box', {
                    width: 1,
                    height: 1,
                    depth: 1,
                    faceColors: [color, color, color, color, color, color]
                }, this.scene)
        
                const yPosition =  nextLayer.height / 2 - (1/2) 
        
                // const initialPosition = new BABYLON.Vector3(
                //     nextLayer.width / 2 - (1/2),
                //     yPosition,
                //     nextLayer.startDepthPosition + (1/2)
                // )

                const initialPosition = new BABYLON.Vector3(
                    nextLayer.width / 2 ,
                    yPosition - j,
                    nextLayer.startDepthPosition + (1/2) + i
                )
        
                box.setPositionWithLocalVector(initialPosition);
        
                const animationVisibility = new BABYLON.Animation(
                    "visibilityAnimation", 
                    "visibility", 
                    30, 
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                );

                const animationWidth = new BABYLON.Animation(
                    "widthAnimation", 
                    "scaling.x", 
                    30, 
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                );
        
                const animationLocation = new BABYLON.Animation(
                    "positionAnimation", 
                    "position", 
                    30, 
                    BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                );

                const TIME_ACROSS = 120
                const FROM_START = 15

                const frame = (FROM_START * (i + 1)) + (j * TIME_ACROSS) + (i * nextLayer.height * TIME_ACROSS)
        
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

                animationWidth.setKeys([
                    {
                        frame: 0,
                        value: 0
                    },
                    {
                        frame: frame,
                        value: 0
                    },
                    {
                        frame: frame + TIME_ACROSS,
                        value: nextLayer.width
                    }
                ]);
        
                animationLocation.setKeys([
                    {
                        frame: 0,
                        value: initialPosition
                    },
                    {
                        frame: frame,
                        value: new BABYLON.Vector3(
                            nextLayer.width / 2 ,
                            yPosition - j,
                            nextLayer.startDepthPosition + (1/2) + i
                        )
                    },
                    {
                        frame: frame + TIME_ACROSS,
                        value: new BABYLON.Vector3(
                            0,
                            yPosition - j,
                            nextLayer.startDepthPosition + (1/2) + i
                        )
                    }
                ])
        
                box.animations = [];
                box.animations.push(animationVisibility);
                box.animations.push(animationWidth);
                box.animations.push(animationLocation);
        
                this.animatedConvBoxes.push(box)
            }
        }       
    }
}
