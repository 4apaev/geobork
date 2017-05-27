'use strict';

module.exports = parse
function parse({ lat, lng, skip, limit }) {
  lat = parseFloat(lat)
  lng = parseFloat(lng)
  skip = 0|skip
  limit = 0|limit

  if (skip<0) skip=0
  if (limit<0) limit=0
  else if (limit>100) limit=100

  if (isNaN(lat)) lat = 0
  else if (lat < -90) lat = -90
  else if (lat > 90) lat = 90

  if (isNaN(lng)) lng = 0
  else if (lng < -180) lng = -180
  else if (lng > 180) lng = 180
  return { loc:[ lat, lng ], skip, limit }
}
