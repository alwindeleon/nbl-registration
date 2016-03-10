var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  MiscFee = mongoose.model('MiscFee');

module.exports = function (app) {
  app.use('/', router);
};

var authorize = function(req, res, next){
  if(req.session && req.session.user){
    next();
  } else {
    return res.status(401);
  }
};

// MISCFEES ENDPOINT (CRUD OPERATIONS)
router.get('/miscfees', authorize, function (req, res, next) {
  MiscFee.find({},
              function(error, miscFees){
                if(error) res.send(error);
                res.render('misc',{miscFees: miscFees});
              });
  // render miscfees
});

router.post('/miscfees', authorize, function(req, res, next){
  var misc = new MiscFee({name:req.body.name, price: req.body.price});
  misc.save(function(error, miscFee){
    if(error) console.log(error);
    res.status(200);
    return next();
  });
  
});

router.put('/miscfees', authorize, function(req, res, next){
  if(!req.body.name || !req.body.price) return next("ERROR: EMPTY BODY");
  MiscFee.findOne({name:req.body.name}, function(error, miscFee){
    if(error) return next(error);
    if(!miscFee) return next('cant update non-existing document');
    miscFee.price = req.body.price;
    miscFee.save();
    res.status(200);
    return next();
  });
});

router.delete('/miscfees', authorize, function(req, res, next){
  MiscFee.find({name:req.body.name}).remove(function(err){
    if(err){
      console.log(err);
      return next();
    }
    res.status(200);
    return next();
  });
});
