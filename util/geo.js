'use strict';


const isNum = x => x===+x
const isRange = (min, x, max) => min <= x && x <= max;

const R = 6371e3; // Radius of the Earth in km
const P = Math.PI/180
const Range = (min, x, max) => isNum(x=parseFloat(x)) && isRange(min, x, max) ? x : max;
const Lat = x => Range(-90, +x, 90)
const Lng = x => Range(-180, +x, 180)
const Coords = ({ lat, lng }) => [ Lat(lat), Lng(lng) ]
const Deg2Rad = deg => deg * P
const Diff = (a, b) => {
  let A = Deg2Rad(a.lat),
      B = Deg2Rad(b.lat),
      C = Deg2Rad(b.lng-a.lng),
      D = Math.sin(A) *
          Math.sin(B) +
          Math.cos(A) *
          Math.cos(B) *
          Math.cos(C)
  return Math.acos(D) * R;
}

module.exports = {  Range, Lat, Lng, Coords, Diff, Deg2Rad }

