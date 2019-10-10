import * as BABYLON from 'babylonjs';
import { GridMaterial } from  'babylonjs-materials';

export const getGridMaterial = (opts) => {
    const { 
        scene, 
        depth, 
        width, 
        height, 
        lineColor, 
        mainColor, 
        opaque, 
    } = opts

    // https://playground.babylonjs.com/#T40FK
    const gridMaterial = new GridMaterial('gridFrontBack', scene)
    gridMaterial.majorUnitFrequency = width;
    gridMaterial.gridOffset = new BABYLON.Vector3(-width/2, -height/2, 0);
	gridMaterial.mainColor = mainColor || new BABYLON.Color3(1, 1, 1);
    gridMaterial.lineColor = lineColor
    if (opaque) {
        gridMaterial.opacity = .9;
    }

    const gridMaterial2 = new GridMaterial('gridSide', scene)
    gridMaterial2.majorUnitFrequency = Math.max(depth, width, height);
    gridMaterial2.gridOffset = new BABYLON.Vector3(-width/2, -height/2, -depth/2);
    gridMaterial2.mainColor = mainColor || new BABYLON.Color3(1, 1, 1);
    gridMaterial2.lineColor = lineColor
    if (opaque) {
        gridMaterial2.opacity = .9;
    }

    var multi = new BABYLON.MultiMaterial("gridCombined", scene);
    multi.subMaterials.push(gridMaterial)
    multi.subMaterials.push(gridMaterial)
    multi.subMaterials.push(gridMaterial2)
    multi.subMaterials.push(gridMaterial2)
    multi.subMaterials.push(gridMaterial2)
    multi.subMaterials.push(gridMaterial2)

    return multi
}

export const addBoxMeshes = box => {
    box.subMeshes = [];
    var verticesCount = box.getTotalVertices();
    box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
    box.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, box));
    box.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, box));
    box.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, box));
    box.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, box));
    box.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, box));
}
