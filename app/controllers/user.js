var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/login', function (req, res, next) {
  if(!req.body.username || !req.body.password)
    return res.render('login',
      {error: 'Please enter your username and password'
    });
  User.findOne({
    username: req.body.username,
    password: req.body.password
  }, function(error, user){
    if(error) return next(error);
    if(!user) return res.render('login',{error: 'Incorrect username and password '});
    req.session.user =user;
    req.session.admin = true;
    res.redirect('/home');
  })

});

router.get('/logout',function(req, res, next){
  res.session.destroy();
  res.redirect('/')
});