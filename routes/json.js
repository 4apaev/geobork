'use strict';

module.exports = json;

function json(res, payload, code) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}
