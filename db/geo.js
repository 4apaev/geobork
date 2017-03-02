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
      query[ this.FIELD ] = GeoDB.near(coords)
      return this.list(name, query);
    }

  index2d(...names) {
      const i = { [ this.FIELD ]: '2dsphere' }
      return this.index(i, ...names)
    }

  update(name, query, item, coords) {
      item[ this.FIELD ] = Coords(coords)
      return super.update(name, query, item)
    }

  static near(coords) {
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