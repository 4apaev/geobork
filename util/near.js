'use strict';
module.exports = near
function near($maxDistance=2000, span=7200000, type='Point') {
  return (coordinates, ago=span) => {
    return {
      updated: {
        $gt: Date.now() - ago
      },
      loc: {
        $near: {
          $maxDistance,
          $geometry: { type, coordinates }
        }
      }
    }
  }
}