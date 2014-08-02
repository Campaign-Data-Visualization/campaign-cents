"use strict";

var express = require('express');
var app = express();
var routers = {};
var DataRequestRouter = express.Router();
routers.DataRequestRouter = DataRequestRouter;

require('./config.js')(app, express, routers);

require('../dataRequestCatcher/dataRequest_routes.js')(DataRequestRouter);

module.exports = exports = app;