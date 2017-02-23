const Is = require('is')

const Range = (min, x, max) => Is.num(x=parseFloat(x)) && Is.range(min, x, max) ? x : max;
const Lat = x => Range(-90, x, 90)
const Lng = x => Range(-180, x, 180)
const Coords = (lng, lat) => [ Lng(lng), Lat(lat) ]

module.exports = {  Range, Lat, Lng, Coords }