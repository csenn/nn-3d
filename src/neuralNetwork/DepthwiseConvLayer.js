import * as BABYLON from 'babylonjs';
import FilterLayer from './FilterLayer'
import { getGridMaterial, addBoxMeshes  } from './utils'

export default class DepthwiseConvLayer extends FilterLayer {
  constructor(config) {
    super(config)
    this.depth = 1;
    this.isDepthwiseConv = true
  }
}