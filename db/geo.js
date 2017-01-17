'use strict';

const Is = require('is');
const DB = require('./base');
const { Range, Coords } = require('../util/geo')

module.exports = class GeoDB extends DB {

  constructor({ limit, field }) {
      super({ limit });
      this.FIELD = field
      this.RADIUS = [ 10, 2000 ]
    }

  set(name, item, long, lat) {
      item[ this.FIELD ] = Coords(long, lat)
      return this.add(name, item)
    }

  get(name, query, long, lat, radius) {
      query[ this.FIELD ] = this.near(long, lat, radius)
      return this.list(name, query);
    }

  index2d(...names) {
      const indx = { [ this.FIELD ]: '2dsphere' }
      return this.index(indx, ...names)
    }

  near(long, lat, radius) {
      const [ min, max ] = this.RADIUS;
      return {
        $near: {
          $maxDistance: Range(min, radius, max),
          $geometry: {
            coordinates: Coords(long, lat),
            type: 'Point'
          }
        }
      }
    }
}