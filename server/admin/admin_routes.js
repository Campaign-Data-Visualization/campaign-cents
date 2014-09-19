"use strict";

var controller = require('./admin_controllers.js');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(400).send({data: {login:0}, error:'Logged Out'}); 
}

module.exports = exports = function(router, app){

  router.route('/adminMap/:action').get(ensureAuthenticated, controller.adminMap);
  
  router.route('/adminSheet/:action').get(ensureAuthenticated, controller.adminSheet);

  router.route('/login').post(app.passport.authenticate('local', {
      successRedirect: 'loginSuccess',
      failureRedirect: 'loginFailure'
    })
  );
  router.route('/loginFailure').get(function(req, res, next) {
    res.send({type: 'login', data: {login:0, message:'Login Failed'}}) 
  });
   
  router.route('/loginSuccess').get(function(req, res, next) {
    res.send({type: 'login', data: {login:1, message:'Login Successful'}});
  });
  
  router.route('/auth/checkLogin').get(ensureAuthenticated, function(req, res, next){
    res.send({type: 'login', data: {login:1, message:'Login Successful'}}); 
  });

  router.route('/auth/logout').get(function(req, res, next){
    req.logout();
    res.send({type: 'login', data: {login:0, message:'Logged Out'}}); 
  });
};
