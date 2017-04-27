'use strict';


const min = 1000*60*30 // 30 min
const max = min*24*365 // year

module.exports = ago => {
  let now = Date.now()
  if (ago < min)
    return now - min
  else if (ago > max)
    return now - max
  else
    return now - ago
}

