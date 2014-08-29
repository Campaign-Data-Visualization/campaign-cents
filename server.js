"use strict";

/*
 *
 * Entry file into the server
 * @app -
 *    our express app. Exported for testing and flexibility.
 *
*/

var app   = require('./server/main/app.js'),
    port  = app.get('port'),
    ip  = app.get('ip'),
    log   = 'Listening on ' + app.get('base url') + ':' + port;

app.listen(port, ip);
console.log(log);
