"use strict";

/*
 * MiddleWare for the entire app
*/

module.exports = exports = {
  fourohfour: function(req, res, next){
    res.status(404);

    // redirect to angular frontend
    if (req.accepts('html')) {
      res.redirect("/#/notFound");
      //res.sendFile('index.html', { root: __dirname + '/../../client'});
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  },

  logError: function (err, req, res, next) {
    if (err) {
      console.error(err);
      return next(err);
    }
    next();
  },

  handleError: function (err, req, res, next) {
    if (err) {
      res.status(500).send({error: err.message, errorType: err.name });
    }
  },

  cors: function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Header', 'Content-type, Authorization, X-Requested-With');

    if (req.method === 'Options') {
      res.send(200);
    } else {
      return next();
    }
  }
};
