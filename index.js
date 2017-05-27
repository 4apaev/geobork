'use strict';

const Fs = require('fs');
const Qs = require('querystring');
const Url = require('url');
const Https = require('https')

const parse = require('./parse')
const json = require('./json')
const { MongoClient } = require('mongodb');

const { PORT = 3000, MONGO_HOST = 'mongodb://localhost:27017/borkdb' } = process.env;
const TIME = 7200000 // 2 hours
const RADIUS = 2000 // 2km
const ROUTE_LIST = '/v2/borks'
const ROUTE_ADD = ROUTE_LIST + '/add'
const COLLECTION = 'borks2'
const certs = {
  key: Fs.readFileSync('./key.pem'),
  cert: Fs.readFileSync('./cert.pem')
}

main()

async function main() {
  const DB = await MongoClient.connect(MONGO_HOST)
  const Col = DB.collection(COLLECTION)
  await Col.createIndex({ updated: 1, loc: '2dsphere' })

  Https.createServer(certs, async (req, res) => {
      const { query, pathname } = Url.parse(req.url)
      try {

        if (req.method!='GET')
          json(req, res, 405)

        else if (pathname==='/')
          json(req, res, 200)

        else if (pathname===ROUTE_LIST) {
          const { loc, skip, limit } = parse(Qs.parse(query))
          const result = await Col.find(near(loc)).skip(skip).limit(limit).toArray()
          json(req, res, 200, { result })
        }

        else if (pathname===ROUTE_ADD) {
          const { loc } = parse(Qs.parse(query))
          const result = await Col.insertOne({ loc, updated: Date.now() })
          json(req, res, 200, { result: result.ops[ 0 ] })
        }

        else
          json(req, res, 404)

      } catch({ message, stack }) {
          json(req, res, 500, { err: { message, stack }})
        }
    })
      .listen(PORT, () => console.log('geobork server on ', PORT))
}

function near(coordinates) {
    return { updated: { $gt: Date.now()-TIME }, loc: { $near: { $maxDistance: RADIUS, $geometry: { type: 'Point', coordinates }}}}
  }