'use strict';

const Qs = require('querystring');
const Url = require('url');
const Http = require('http');
const { assign } = Object

class App {
  constructor() {
      this.routes = [];
    }

  queue(req, res, done) {
    let i = -1;
    const next = err => {
      const route = this.routes[++i];

      if (err || !route)
        return done.call(this, err, req, res);

      if (!route.pass(req))
        return next();

      try {
        route.cb.call(this, req, res, next);
      } catch (err) {
        err.msg = `route ${ i }`
        next(err);
      }
    }
    next();
  }

  use(method, url, cb) {
    if ('function'===typeof method)
      cb = method, method = null, url = null;

    else if ('function'===typeof url)
      cb = url, url = null;

    const terms = [];

    method && terms.unshift(req => method===req.method);
    url && terms.unshift(url instanceof RegExp
                         ? req => url.test(req.pathname)
                         : req => url === req.pathname);
    const pass = terms.length
      ? req => terms.every(fn => fn(req))
      : () => !0

    this.routes.push({ pass, cb });
    return this
  }

  listen(port, done) {
      this.server = Http.createServer((req, res) => {
        assign(req, Url.parse(req.url))
        req.query = Qs.parse(req.query)
        this.queue(req, res, done)
      })
      this.server.listen(port)
      return this;
    }

  get(url, cb) { return this.use('GET', url, cb) }
  post(url, cb) { return this.use('POST', url, cb) }
}

module.exports = () => new App;