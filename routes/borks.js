'use strict';

const json = require('./json')

exports.get = get
exports.set = set

function get(req, res) {
    const { lng, lat, type, radius } = req.query;
    const { NAME } = this.Conf;
    return this.DB
                .get(NAME, { type }, lng, lat, radius)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }

function set(req, res) {
    const { lng, lat, type, name=type } = req.body;
    const { NAME } = this.Conf;
    return this.DB
                .set(NAME, { type, name }, lng, lat)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }


