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
  .then(DB => DB.collection(COLLECTION).createIndex({ updated: 1, loc: '2dsphere' })
        .then(() => DB.collection(COLLECTION)))
  .then(Col => {
    Https.createServer(certs, (req, res) => {
      const { query, pathname } = Url.parse(req.url)
      if (req.method!='GET') json(req, res, 405)
      else if (pathname==='/') json(req, res, 200)
      else if (pathname===ROUTE_LIST) list(req, res, Col, parse(Qs.parse(query)))
      else if (pathname===ROUTE_ADD) add(req, res, Col, parse(Qs.parse(query)))
      else json(req, res, 404)
    })
      .listen(PORT, () => log('geobork server on ', PORT))
  })
  .catch(err => {
    log('FAIL CONNECT TO MONGO')
    log(err)
    process.exit(1)
  })

function add(req, res, Col, { loc }) {
    Col.insertOne({ loc, updated: Date.now() })
        .then(x => {
          json(req, res, 200, { result: x.ops[ 0 ] })
        })
        .catch(({ message, stack }) => {
            json(req, res, 500, { err: { message, stack }})
          })
  }

function list(req, res, Col, { loc, skip, limit }) {
    Col.find({
      updated: { $gt: Date.now()-TIME },
      loc: { $near: { $maxDistance: RADIUS, $geometry: { type: 'Point', coordinates:loc }}}
    })
      .skip(skip)
      .limit(limit)
      .toArray()
      .then(result => {
          json(req, res, 200, { result })
        })
      .catch(({ message, stack }) => {
          json(req, res, 500, { err: { message, stack }})
        })
  }

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
  log(code, req.method, req.url)
}

function parse({ lat, lng, skip, limit }) {
  lat = parseFloat(lat)
  lng = parseFloat(lng)
  skip = 0|skip
  limit = 0|limit

  if (skip<0) skip=0
  if (limit<0) limit=0
  else if (limit>100) limit=100

  if (isNaN(lat)) lat = 0
  else if (lat < -90) lat = -90
  else if (lat > 90) lat = 90

  if (isNaN(lng)) lng = 0
  else if (lng < -180) lng = -180
  else if (lng > 180) lng = 180
  return { loc:[ lat, lng ], skip, limit }
}
