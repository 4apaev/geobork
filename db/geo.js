'use strict';

const DB = require('./base');
const { Range, Coords } = require('../util/geo')

module.exports = class GeoDB extends DB {

  constructor({ limit, field }) {
      super({ limit });
      this.FIELD = field
      this.RADIUS = [ 10, 2000 ]
    }

  set(name, item, lng, lat) {
      item[ this.FIELD ] = Coords(lng, lat)
      return this.add(name, item)
    }

  get(name, query, lng, lat, radius) {
      query[ this.FIELD ] = this.near(lng, lat, radius)
      return this.list(name, query);
    }

  index2d(...names) {
      const indx = { [ this.FIELD ]: '2dsphere' }
      return this.index(indx, ...names)
    }

  near(lng, lat, radius) {
      const [ min, max ] = this.RADIUS
      const maxdist = Range(min, radius, max)
      const coordinates = Coords(lng, lat)
      return {
        $near: {
          $maxDistance: maxdist,
          $geometry: {
            coordinates,
            type: 'Point'
          }
        }
      }
    }
}