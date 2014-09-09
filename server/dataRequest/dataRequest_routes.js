"use strict";

var controller = require('./dataRequest_controllers.js');

module.exports = exports = function(router, app){
  router.route('/search/:value').get(controller.search);

  router.route('/zip/:zipcode').get(controller.lookupZip);

  router.route('/candidate/:candidateId').get(controller.lookupCandidate);

  //I have no idea why router.route('/candidate/:candidateId/bio') doesn't work
  router.route('/candidate/:candidateId/:bio').get(controller.lookupCandidateBio);

  router.route('/map/:mapType').get(controller.lookupMapData);

  router.route('/assets/:action/:state').get(controller.lookupAssets);

  router.route('/states/:state').get(controller.lookupStates);

  router.route('/admin/:action').get(app.basicAuth, controller.admin);


};
