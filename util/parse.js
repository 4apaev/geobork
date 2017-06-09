'use strict';
const Qs = require('querystring');
const Tic = require('./tic');
const [ YEAR, MONTH, WEEK, DAY, HOUR, MINUTE ] = Tic.Units.map(x => x.ms)
const LIMIT = 100
const SKIP  = 999
const LAT  = 90
const LNG  = LAT*2
const AGO = HOUR * 2
const range = (min,x,max,def=0) => x===+x && x>=min && x<=max ? x : def

module.exports = parse
function parse(query, Fn=Qs) {
  let { lat, lng, skip, limit ,m,h,d,ago } = Fn.parse(query)
  return {
    ago: range(HOUR, Tic.sum({ m, h, d }, 0|ago), YEAR, AGO),
    loc: [ range(-LAT, parseFloat(lat)||0, LAT), range(-LNG, parseFloat(lng)||0, LNG) ],
    skip: range(0, 0|skip, SKIP),
    limit: range(0, 0|limit, LIMIT),
    type: 'bork'
  }
}

