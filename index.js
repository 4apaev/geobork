'use strict';
const { log } = console
const Fs = require('fs');
const Url = require('url');
const Https = require('https')
const { MongoClient } = require('mongodb');
const parse = require('./util/parse')
const json = require('./util/json')
const near = require('./util/near')(1000, 1000*60*60*24*90)

;(async (Certs, Route, { PORT=3000, MONGO_HOST='mongodb://localhost:27017/borkdb' }) => {
  const DB = await MongoClient.connect(MONGO_HOST)
  const Coll = DB.collection('borks2')
  await Coll.createIndex({ updated: 1, loc: '2dsphere' })

  Https.createServer(Certs, async (req, res) => {
      const { query, pathname } = Url.parse(req.url)
      try {
        if (req.method==='GET' && pathname==='/') {
          json(req, res, 200)
        }
        else if (req.method==='GET' && pathname===Route.borks) {
          const { loc, skip, limit, ago  } = parse(query)
          const needle = near(loc, ago);
          const cursor = Coll.find(needle).skip(skip).limit(limit);
          const total = await cursor.count()
          const result = await cursor.toArray()
          json(req, res, 200, { result, skip, limit, total })
        }
        else if (req.method==='POST' && pathname===Route.borks) {
          let q = ''
          req.on('data', chunk => q+=chunk)
          req.on('end', async () => {
              const { loc, type, updated=Date.now() } = parse(q, JSON)
              const result = await Coll.insertOne({ loc, type, updated });
              json(req, res, 200, { result: result.ops[ 0 ] })
          })
        }
        else {
          json(req, res, 404)
        }
      } catch({ name, message, stack }) {
          json(req, res, 500, { err: { name, message, stack }})
        }
    })
      .listen(PORT, () => {
          log('geobork server on', PORT)
        });

})({
  key: Fs.readFileSync('./conf/key.pem'),
  cert: Fs.readFileSync('./conf/cert.pem')
}, {
  home: '/',
  borks: '/v2/borks'
}, process.env);
