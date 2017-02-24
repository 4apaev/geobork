'use strict';

const json = require('./json')

exports.get = get
exports.set = set

function get(req, res) {
    const { lat, lng, type, radius } = req.query;
    const { NAME } = this.Conf;

    const coords = { lat, lng, radius }
    const query = { }

    type && (query.type = type)

    return this.DB
                .get(NAME, query, coords)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }

function set(req, res) {
    const { lat, lng, type, name=type } = req.body;
    const { NAME } = this.Conf;

    const item = { type, name }
    const coords = { lat, lng }

    return this.DB
                .set(NAME, item, coords)
                .then(x => json(res, x, 200))
                .catch(e => json(res, e, 500));
  }


