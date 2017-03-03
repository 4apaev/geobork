'use strict';

const DB = require('./base');
const { Range, Coords } = require('../util/geo')

module.exports = class GeoDB extends DB {
  constructor({ name, limit, field }) {
    super({ name, limit, })
    this.FIELD = field
  }

  add(item, coords) {
      item[ this.FIELD ] = Coords(coords)
      return super.add(item)
    }

  list(query, coords) {
      query[ this.FIELD ] = GeoDB.near(coords)
      return super.list(query);
    }

  update(query, item, coords) {
      item[ this.FIELD ] = Coords(coords)
      return super.update(query, item)
    }

  index2d(...names) {
      const i = { [ this.FIELD ]: '2dsphere' }
      return this.index(i, ...names)
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