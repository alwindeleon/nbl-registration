var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  CurrentYear = mongoose.model('CurrentYear');

module.exports = function (app) {
  app.use('/', router);
};

var sem =['sem1', 'sem2'];
var quarter = ['quarter1','quarter2','quarter3','quarter4'];
var month =  [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
var possibleFees= sem.concat(quarter,month);

//protect this route 
router.get('/print', function (req, res, next) {
    return res.render('print');
});


router.get('/printsection', function (req, res, next) {
    return res.render('print_section');
});
router.post('/printsection',function(req, res, next){
  if(!req.body.section) return res.render('print_section',{message:'please input section'});
  CurrentYear.find({}, function(error, year){
    year = year[0];
    Student.find({section:req.body.section,yearEnrolled:year.a+'-'+year.b}, function(error, students){
      console.log(students);
      if(error){
        console.log(error);
        return res.send('error');
      }
      if(!students || students.length == 0) return res.render('print_section',{message:"no such section"})
      return res.render('print_section_result',{section: req.body.section, students:students});
    })
  });
  
});

router.get('/printlevel', function (req, res, next) {
    return res.render('print_level');
});
router.post('/printlevel',function(req, res, next){
  if(!req.body.level) return res.render('print_level',{message:'pleasei input level'});
  CurrentYear.find({},function(error, year){
    year = year[0];
    Student.find({yearLevel:req.body.level,yearEnrolled:year.a+'-'+year.b}, function(error, students){
      console.log(students);
      if(error){
        console.log(error);
        return res.send('error');
      }
      if(!students || students.length == 0) return res.render('print_level',{message:"no such level"})
      return res.render('print_level_result',{level: req.body.level, students:students});
    });
  });
});


router.get('/printsoa', function (req, res, next) {
    return res.render('print_soa',{possibleFees:possibleFees});
});

router.post('/printsoa',function(req, res, next){
  console.log(req.body.name);
  CurrentYear.find({},function(error,year){
    year = year[0].a +'-'+year[0].b;
    Student.find({
      "$or": [
          { "unpaidFees": { 
              "$elemMatch": { "name": req.body.name,} 
          }}
      ],
      yearEnrolled:year
  },function(error, students){
      var total_amounts = [];
      var curUnpaid = []
      for(var i = 0; i < students.length; i++){
        var amount = 0;
        for(var j = 0; j < students[i].unpaidFees.length; j++ ){
            amount +=  students[i].unpaidFees[j].price;
        }
        total_amounts.push(amount);
      }
      if(students.length == 0) return res.render('print_soa',{possibleFees:possibleFees,message:"no student has "+req.body.name+" fee"});
      return res.render('print_soa_result',{students:students,date:req.body.date,total_amounts:total_amounts,shouldpay:req.body.name});
    })
  })
  
});

router.get('/printdeped', function (req, res, next) {
  CurrentYear.find({},function(error, year){
    year = year[0];
    Student.find({yearEnrolled:year.a+'-'+year.b},function(error, students){
      if(error){
        console.log(error);
        return res.send('error');
      }
      return res.render('print_deped',{students:students});
    });
  });
});

router.get('/printallaccounts',function(req, res, next){
  Student.find({},function(error, students){
    var paid = [];
    var unpaid = [];
    for(var i = 0; i < students.length; i++){
      for(var j = 0; j < students[i].unpaidFees.length; j++){
        // console.log(students[i].unpaidFees[j]);
        students[i].unpaidFees[j]['person'] = students[i].firstName+' '+students[i].lastName;
        // console.log(students[i].unpaidFees[j]);
      }
      // console.log(students[i].unpaidFees)
      // console.log(students[i].paymentHistory)
      unpaid = unpaid.concat(students[i].unpaidFees);
      paid = paid.concat(students[i].paymentHistory);
    };
    totalPaid = 0;
    totalUnpaid = 0;
    console.log(unpaid);
    for(var i = 0 ; i < paid.length; i++){
      totalPaid += paid[i].amountReceived;
    };
    for(var i = 0 ; i < unpaid.length; i++){
      if(!unpaid[i].price) continue;
      console.log(unpaid[i].price)
      totalUnpaid += unpaid[i].price;
    };
    console.log(totalUnpaid)
    res.send({'paid': totalPaid, 'unpaid': roundUp2Deci(totalUnpaid)});

  }); 
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function roundUp2Deci(x){
  return Number(Math.round(x+'e2')+'e-2').toFixed(2);
}

