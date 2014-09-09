"use strict";

var controller = require('./admin_controllers.js');

module.exports = exports = function(router, app){

  router.route('/adminMap/:action').get(app.basicAuth, controller.adminMap);
  
  router.route('/adminSheet/:action').get(app.basicAuth, controller.adminSheet);

};
