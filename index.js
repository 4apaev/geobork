'use strict';

global.log = console.log.bind(console)

const app = require('./util/server')()
const Borks = require('./routes/borks')
const GeoDB = require('./db/geo')
const Conf = app.Conf = require('./config.json')

const DB = app.DB = new GeoDB({
  limit: 100,
  field: Conf.FIELD
});

DB.connect(Conf.HOST)
  .then(() =>
        DB.index2d(Conf.NAME))

  .then(() =>
    app
      .use(require('./middleware/logger')('statusCode', 'method', 'url'))
      .use(require('./middleware/cors'))
      .post(require('./middleware/body'))
      .get(Conf.ROUTE, Borks.get)
      .post(Conf.ROUTE, Borks.set)
      .listen(Conf.PORT, require('./middleware/finish')))

  .then(() =>
    log(`running on localhost:`, Conf.PORT))

  .catch(err => {
    log(err)
    process.exit(1)
  });

