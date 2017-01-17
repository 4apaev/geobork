'use strict';

module.exports = (req, res, next) => {
  req.body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => req.body += chunk);
  req.on('end', () => {
    if ('application/json' === req.headers['content-type'] && req.body.length) {
      try {
        req.body = JSON.parse(req.body);
        next();
      } catch (e) {
        res.statusCode = 400;
        res.end(e.message || e);
      }
    } else { next(); }
  });
};