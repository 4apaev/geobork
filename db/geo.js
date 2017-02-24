'use strict';

const DB = require('./base');
const { Range, Coords } = require('../util/geo')

module.exports = class GeoDB extends DB {

  constructor({ limit, field }) {
      super({ limit });
      this.FIELD = field
    }

  set(name, item, coords) {
      item[ this.FIELD ] = Coords(coords)
      return this.add(name, item)
    }

  get(name, query, coords) {
      query[ this.FIELD ] = this.near(coords)
      return this.list(name, query);
    }

  index2d(...names) {
      const indx = { [ this.FIELD ]: '2dsphere' }
      return this.index(indx, ...names)
    }

  near(coords) {
      return {
        $near: {
          $maxDistance: Range(100, coords.radius, 2000),
          $geometry: {
            coordinates: Coords(coords),
            type: 'Point'
          }
        }
      }
    }
}