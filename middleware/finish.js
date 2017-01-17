'use strict';
module.exports = fin;
function fin(err, req, res) {

  if (err) {
    let { name, stack, message, msg='*** NOT QUEUE ERROR ***' } = err;

    if( res.statusCode===200 )
      res.statusCode = 500

    let buf = `
      ============================ ERROR: ${ name } ============================
      [ ${ res.statusCode } ] ${ req.method } ${ req.url }
      ............................... message ...............................
      ${ msg }
      ${ message }
      ............................... stack ...............................
      ${ stack }`

    console.log(buf);

    res.setHeader('Content-Type', 'text/plain');
    res.end(buf)
  } else {
    res.statusCode = 200
    res.end('ok')
  }
}