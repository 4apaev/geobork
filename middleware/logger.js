'use strict';

const now = () => new Date().toTimeString().slice(0,8)

function logger(...args) {
  return (req, res, next) => {
    res.once('finish', () => console.log(now(), ...args.map(k => req[ k ] || res[ k ])));
    next();
  }
}

module.exports = logger