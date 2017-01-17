const Is = require('is')

const Range = (min, x, max) => Is.num(x=parseFloat(x)) && Is.range(min, x, max) ? x : max;
const Lat = x => Range(-90, x, 90)
const Long = x => Range(-180, x, 180)
const Coords = (long, lat) => [ Long(long), Lat(lat) ]

module.exports = {  Range, Lat, Long, Coords }