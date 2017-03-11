'use strict';

global.log = console.log.bind(console)

const app = require('miniserver')()
const Borks = require('./routes/borks')
const GeoDB = require('./db/geo')
const Conf = app.Conf = require('./config.json')

const DB = app.DB = new GeoDB({
  limit: 100,
  name: Conf.NAME,
  field: Conf.FIELD
});

DB.connect(Conf.HOST)
  .then(() =>
        DB.index2d(Conf.NAME))

  .then(() =>
    app
      .use(require('miniserver/middleware/logger')('statusCode', 'method', 'url'))
      .use(require('miniserver/middleware/cors'))
      .post(require('miniserver/middleware/body'))
      .get(Conf.ROUTE, Borks.list)
      .post(Conf.ROUTE, Borks.add)
      .listen(Conf.PORT, () => log(`running on localhost:`, Conf.PORT)))

  .catch(err => {
    log(err)
    process.exit(1)
  });

