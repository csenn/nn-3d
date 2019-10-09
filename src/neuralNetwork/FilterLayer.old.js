import * as BABYLON from 'babylonjs';
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class FilterLayer {
    constructor (nn, config, startDepthPosition, layerIndex) {
        this.nn = nn;
        this.scene = nn.scene
        this.config = config
        this.startDepthPosition = startDepthPosition
        this.endPosition = startDepthPosition + this.config.depth
        this.layerIndex = layerIndex

        this.animatedBoxes = []
    }

    getEndPosition () {
        return this.startDepthPosition + this.config.depth
    }

    animate() {
        this._animateFilterBox(0)
    }

    build () {
        const { filterDepth, depth, width, height } = this.config

        const orange = new BABYLON.Color3(1,0.6,0)
        const multi = getGridMaterial(this.scene, this.config, orange, false)

        const root = Math.ceil(Math.sqrt(filterDepth))

        let counter = 0
        for (let i=0; i < root; i++) {
            for (let j=0; j< root; j++) {
                if (j * root + i + 1 > filterDepth) {
                    continue
                }

                const box = BABYLON.MeshBuilder.CreateBox('box', {
                    width: width, 
                    height: height, 
                    depth: depth,
                }, this.scene)
    
                const BUFFER = 2
    
                const position = new BABYLON.Vector3(
                    - i * (width + BUFFER) + (root/2) * (width + BUFFER), 
                    - j * (height + BUFFER) + (root/2) * (height + BUFFER), 
                    this.startDepthPosition + depth / 2
                )
    
                addBoxMeshes(box)
                box.material = multi
                box.setPositionWithLocalVector(position);

                const animationBox = new BABYLON.Animation(
                    "myAnimation", 
                    "position", 
                    30, 
                    BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                );

                const { keys, convBoxes } = this._getAnimationKeysForBox(position, counter)
                animationBox.setKeys(keys);
                box.animations = [];
                box.animations.push(animationBox);   

                this.animatedBoxes.push({ filterBox: box, convBoxes })

                counter += 1
            }
        }
    }

    _animateFilterBox(filterBoxIndex) {
        if (filterBoxIndex === this.animatedBoxes.length) {
            return this._animateFilterBox(0)
        }

        const onAnimationEnd = () => this._animateFilterBox(filterBoxIndex + 1)
        const { filterBox, convBoxes } = this.animatedBoxes[filterBoxIndex]

        this.scene.beginAnimation(filterBox, 0, 10000, false, 1, onAnimationEnd);
        convBoxes.forEach(convBox => this.scene.beginAnimation(convBox, 0, 10000, false,))
    }

    _getAnimationKeysForBox (startPosition, boxNumber) {
        const prevLayer = this.nn.getLayerAtIndex(this.layerIndex - 1)
        const prevConvConfig = prevLayer.config
        const prevConvStartPosition = prevLayer.startDepthPosition

        const keys = []
        const convBoxes = []
        const dim = prevConvConfig.width - this.config.width

        let x = prevConvConfig.width / 2 - (this.config.width / 2)
        let y = prevConvConfig.height / 2 - (this.config.height / 2)
        let z = prevConvStartPosition + (this.config.depth / 2)

        keys.push({
            frame: 0,
            value: startPosition
        });

        let frame = null
        const CROSS_TIME = 60

        for (let i = 0; i < prevConvConfig.height; i++) {

            frame = 30 + CROSS_TIME * i

            keys.push({
                frame: frame,
                value: new BABYLON.Vector3(x, y, z)
            })

            keys.push({
                frame: frame + CROSS_TIME,
                value: new BABYLON.Vector3(x - dim, y, z)
            })

            y -= 1

            convBoxes.push(this._createAnimatedConvBox(i, frame, boxNumber))
        }

        keys.push({
            frame: frame + CROSS_TIME * 2,
            value: startPosition
        })

        return { keys, convBoxes }
    }

    _createAnimatedConvBox(index, frame, boxNumber) {
        const nextLayer = this.nn.getLayerAtIndex(this.layerIndex + 1)

        const color = new BABYLON.Color3(1,1,0)

        const box = BABYLON.MeshBuilder.CreateBox('box', {
            width: 1,
            height: 1,
            depth: 1,
            faceColors: [color, color, color, color, color, color]
        }, this.scene)

        const yPosition =  nextLayer.config.height / 2 - (1/2) 

        const initialPosition = new BABYLON.Vector3(
            nextLayer.config.width / 2 - (1/2),
            yPosition,
            nextLayer.startDepthPosition + (1/2)
        )

        box.setPositionWithLocalVector(initialPosition);

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
                frame: frame + 60,
                value: nextLayer.config.width
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
                    nextLayer.config.width / 2 ,
                    yPosition - index,
                    nextLayer.startDepthPosition + (1/2) + boxNumber
                )
            },
            {
                frame: frame + 60,
                value: new BABYLON.Vector3(
                    0,
                    yPosition - index,
                    nextLayer.startDepthPosition + (1/2) + boxNumber
                )
            }
        ])

        box.animations = [];
        box.animations.push(animationWidth);
        box.animations.push(animationLocation);

        return box
    }
}
