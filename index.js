'use strict';

global.log = console.log.bind(console)

const { PORT=3000, MONGO_HOST='mongodb://localhost:27017/borkdb' } = process.env;
const app = require('miniserver')()
const Borks = require('./routes/borks')
const GeoDB = require('./db/geo')
const Conf = app.Conf = require('./config.json')

const DB = app.DB = new GeoDB({
  limit: 100,
  name: Conf.NAME,
  field: Conf.FIELD
});

DB.connect(MONGO_HOST)
  .then(() =>
        DB.index2d(Conf.NAME))

  .then(() =>
    app
      .use(require('miniserver/middleware/logger')('statusCode', 'method', 'url'))
      .use(require('miniserver/middleware/cors'))
      .post(require('miniserver/middleware/body'))

      .get('/', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('ok');
      })

      .get(Conf.ROUTE, Borks.list)
      .post(Conf.ROUTE, Borks.add)
      .listen(PORT, () => log(`
==========================
  connected to ${ MONGO_HOST }
  running on localhost:${ PORT }
==========================
    `)))

  .catch(err => {
    log(err)
  });