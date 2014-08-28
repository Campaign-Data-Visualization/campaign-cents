"use strict";

var controller = require('./dataRequest_controllers.js');

module.exports = exports = function(router){
  router.route('/search/:value').get(controller.search);

  router.route('/')
    .get(controller.get)
    .post(controller.post);

};
