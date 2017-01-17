'use strict';

const json = require('./json')

exports.get = get
exports.set = set

function get(req, res) {
    const { long, lat, type, radius } = req.query;
    const { NAME } = this.Conf;
    return this.DB
                .get(NAME, { type }, long, lat, radius)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }

function set(req, res) {
    const { long, lat, type, name=type } = req.body;
    const { NAME } = this.Conf;
    return this.DB
                .set(NAME, { type, name }, long, lat)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }


