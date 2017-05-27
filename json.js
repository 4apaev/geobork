'use strict';
const { STATUS_CODES } = require('http')

module.exports = json
function json(req, res, code, payload={}) {
  payload.ok = code===200
  const body = JSON.stringify(payload)
  res.statusCode = code;
  res.statusMessage = STATUS_CODES[ code ];
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
  console.log(code, req.method, req.url)
}
