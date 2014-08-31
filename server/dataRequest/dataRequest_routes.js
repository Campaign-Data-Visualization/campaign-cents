"use strict";

var controller = require('./dataRequest_controllers.js');

module.exports = exports = function(router){
  router.route('/search/:value').get(controller.search);

  router.route('/zip/:zipcode').get(controller.lookupZip);

  router.route('/candidate/:candidateId').get(controller.lookupCandidate);

};
