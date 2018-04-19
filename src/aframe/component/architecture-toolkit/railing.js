'use strict';

import getSchema from './common/get-schema.js'
import getMaterial from '../../../scene/structure/parametric-objects/common/get-material.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'
import wallRailing3d from '../../../scene/structure/parametric-objects/railing'

export default {

  schema: getSchema('railing'),

  init: function () {},

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    // setup materials
    // defaults
    var materials = {
      railing: {
        colorDiffuse: [0.85, 0.85, 0.0]
      }
    }

    // check for adapted materials
    var materialKeys = Object.keys(data).filter(function(key) {
      return key.indexOf('material_') > -1
    })
    // add materials to instance
    materialKeys.forEach(function(key) {
      var mesh = key.replace('material_', '')
      materials[mesh] = data[key]
    })

    // fetch materials from mat library
    Object.keys(materials).forEach(mat => {
      materials[mat] = getMaterial(materials[mat])
    })

    attributes.materials = materials;

    // construct data3d object
    let data3d = await wallRailing3d(attributes)

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh})

    // update view
    this_.data3dView.set(data3d)
    this_.el.setObject3D('mesh', this_.mesh)
    // emit event
    this_.el.emit('mesh-updated');
  },

  remove: function () {
    if (this.data3dView) {
      this.data3dView.destroy()
      this.data3dView = null
    }
    if (this.mesh) {
      this.el.removeObject3D('mesh')
      this.mesh = null
    }
  },

}
