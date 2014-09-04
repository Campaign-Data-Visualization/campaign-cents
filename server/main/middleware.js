"use strict";

/*
 * MiddleWare for the entire app
*/

module.exports = exports = {
  fourohfour: function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
      res.redirect("/#/notFound");
      //res.render('404', { url: req.url });
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
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Controll-Allow-Header', 'Content-type, Authorization');

    if (req.method === 'Options') {
      res.send(200);
    } else {
      return next();
    }
  }
};
