"use strict";

var controller = require('./dataRequest_controllers.js');


module.exports = exports = function (router) {
  router.route('/dataRequest')
    .get(controller.get)
    .post(controller.post);
};