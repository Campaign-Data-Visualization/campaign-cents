"use strict";

var express = require('express');
var app = express();
var routers = {};
var DataRequestRouter = express.Router();
routers.DataRequestRouter = DataRequestRouter;
var AdminRouter = express.Router();
routers.AdminRouter = AdminRouter;

require('./config.js')(app, express, routers);

require('../dataRequest/dataRequest_routes.js')(DataRequestRouter, app);
require('../admin/admin_routes.js')(AdminRouter, app);

module.exports = exports = app;
