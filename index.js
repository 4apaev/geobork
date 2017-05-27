'use strict';

const { log } = console
const { PORT = 3000, MONGO_HOST = 'mongodb://localhost:27017/borkdb' } = process.env;
const Fs = require('fs');
const Qs = require('querystring');
const Url = require('url');
const { STATUS_CODES } = require('http')
const Https = require('https')
const { MongoClient, ObjectID } = require('mongodb');

const TIME = 7200000 // 2 hours
const RADIUS = 2000 // 2km
const ROUTE_LIST = '/v2/borks'
const ROUTE_ADD = ROUTE_LIST + '/add'
const COLLECTION = 'borks2'
const certs = {
  key: Fs.readFileSync('./key.pem'),
  cert: Fs.readFileSync('./cert.pem')
}

MongoClient.connect(MONGO_HOST)
  .then(DB => {
    const Col = DB.collection(COLLECTION)
    return Col.createIndex({
      updated: 1,
      loc: '2dsphere'
    })
      .then(() => Col)
  })
  .then(Col => {

  Https.createServer(certs, (req, res) => {
    const { query, pathname } = Url.parse(req.url)
    if (req.method!='GET')
      return json(req, res, { ok:false }, 405)
    if (pathname==='/')
      return json(req, res, { ok:true }, 200)
    if (pathname!=ROUTE_LIST && pathname!=ROUTE_ADD)
      return json(req, res, { ok:false }, 404)

    const now = Date.now()
    const { lat, lng, skip, limit } = parse(Qs.parse(query))

    const prm = pathname===ROUTE_LIST
      ? Col.find({ updated: { $gt: now-TIME }, loc: { $near: { $maxDistance: RADIUS, $geometry: { type: 'Point', coordinates: [ lat, lng ] }}}})
            .skip(skip)
            .limit(limit)
            .toArray()
            .then(result => {
              json(req, res, { ok:true, result }, 200)
            })
      : Col.insertOne({ loc: [ lat, lng ], updated: now })
            .then(x => {
              const result = x.ops[ 0 ]
              json(req, res, { ok:true, result }, 200)
            })

    prm.catch(err => {
      json(req, res, { ok: false, err: { message:err.message, stack:err.stack }}, 500)
    })


  }).listen(PORT, () => {
    log('geobork server on ', PORT)
  })


}).catch(err => {
  log('FAIL TO CONNECT MONGO')
  log(err)
  process.exit(1)
})


function json(req, res, payload, code) {
  const body = JSON.stringify(payload)
  res.statusCode = code;
  res.statusMessage = STATUS_CODES[ code ];
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
  log(code, req.method, req.url)
}

function parse({ lat, lng, skip, limit }) {
  lat = parseFloat(lat)
  lng = parseFloat(lng)
  skip = 0|skip
  limit = 0|limit

  if (skip<0)
    skip=0

  if (limit<0)
    limit=0
  else if (limit>100)
    limit=100

  if (isNaN(lat))
    lat = 0
  else if (lat < -90)
    lat = -90
  else if (lat > 90)
    lat = 90

  if (isNaN(lng))
    lng = 0
  else if (lng < -180)
    lng = -180
  else if (lng > 180)
    lng = 180
  return { lat, lng, skip, limit }
}
