var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Section = mongoose.model('Section');

module.exports = function (app) {
  app.use('/', router);
};

var authorize = function(req, res, next){
  if(req.session && req.session.user){
    next();
  } else {
    return res.send(401);
  }

};

router.get('/', function (req, res, next) {

  res.render('login');
    
});

//protect this route 
router.get('/home',authorize, function (req, res, next) {
    res.render('index');
});


router.get('logout',function(req, res ,next){
  req.session.destroy();
  return res.render('login');
});

