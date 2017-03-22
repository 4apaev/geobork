'use strict';

const json = require('./json')
const time = require('../util/time')

exports.list = list
exports.add = add

function list(req, res) {
    const { lat, lng, type, radius, ago } = req.query;
    const query = { updated: { $gt: time(0|ago) } }

    type && (query.type = type)
    return this.DB.list(query, { lat, lng, radius })
                  .then(x => json(res, x, 200))
                  .catch(e => json(res, e, 500));
  }

function add(req, res) {
    const { lat, lng, type, name=type } = req.body;
    return this.DB.add({ type, name }, { lat, lng })
                  .then(x => json(res, x, 200))
                  .catch(e => json(res, e, 500));
  }


