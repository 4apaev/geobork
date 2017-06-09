'use strict';
const { STATUS_CODES } = require('http')
const { log } = console

module.exports = json
function json(req, res, code, payload) {
  const message = STATUS_CODES[ code ]
  const body = JSON.stringify((payload || (code===200
        ? { ok: !0 }
        : { err: { message }})), 0, 2)
  res.writeHead(code, message, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
  res.end(body);
  log(new Date().toString(), code, req.method, req.url)
}