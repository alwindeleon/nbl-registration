var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  CurrentYear = mongoose.model('CurrentYear');

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

var sem =['sem1', 'sem2'];
var quarter = ['quarter1','quarter2','quarter3','quarter4'];
var month =  [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
var possibleFees= sem.concat(quarter,month);

//protect this route 
router.get('/print', authorize, function (req, res, next) {
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
  if(!req.body.level) return res.render('print_level',{message:'please input level'});
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

router.get('/printsoachoice',function(req, res, next){
  return res.render('soa_choice');
});

router.post('/soa_choice',function(req, res, next){
  category = req.body.category;
  filter = req.body.filter;
  CurrentYear.find({},function(error, year){
    year = year[0];
    if(category == 'section'){
      Student.find({section:filter,yearEnrolled:year.a+"-"+year.b},function(error, students){
        if(students == null || students.length == 0){
          return res.render('soa_choice',{message:"no such section"})
        }
        var total_amounts = [];
        var curUnpaid = []
        for(var i = 0; i < students.length; i++){
          var amount = 0;
          for(var j = 0; j < students[i].unpaidFees.length; j++ ){
              amount +=  students[i].unpaidFees[j].price;
          }
          total_amounts.push(amount);
        }
        if(students.length == 0) return res.render('print_soa',{possibleFees:possibleFees,message:"there is no such section"});
        return res.render('print_soa_result',{students:students,date:req.body.date,total_amounts:total_amounts,shouldpay:req.body.name});
      });  
    }
    else if(category == 'level'){
       Student.find({yearLevel:filter,yearEnrolled:year.a+"-"+year.b},function(error, students){
        if(students == null || students.length == 0){
          return res.render('soa_choice',{message:"no such level"})
        }
        var total_amounts = [];
        var curUnpaid = []
        for(var i = 0; i < students.length; i++){
          var amount = 0;
          for(var j = 0; j < students[i].unpaidFees.length; j++ ){
              amount +=  students[i].unpaidFees[j].price;
          }
          total_amounts.push(amount);
        }
        if(students.length == 0) return res.render('print_soa',{possibleFees:possibleFees,message:"there is no such yearlevel"});
        return res.render('print_soa_result',{students:students,date:req.body.date,total_amounts:total_amounts,shouldpay:req.body.name});
      });  
    }
    else if(category == 'student'){
      Student.findOne({studentNumber:filter},function(error, student){
        if(student == null){
          return res.render('soa_choice',{message:"no such student with that student number"})
        }
        students = [student];
        var total_amounts = [];
        var curUnpaid = []
        for(var i = 0; i < students.length; i++){
          var amount = 0;
          for(var j = 0; j < students[i].unpaidFees.length; j++ ){
              amount +=  students[i].unpaidFees[j].price;
          }
          total_amounts.push(amount);
        }
        if(students.length == 0) return res.render('print_soa',{possibleFees:possibleFees,message:"there is no such yearlevel"});
        return res.render('print_soa_result',{students:students,date:req.body.date,total_amounts:total_amounts,shouldpay:req.body.name});
      });  
    }
    
  });
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

router.get('/masterdetails',function(req, res, next){

  CurrentYear.find({}, function(error, year){
    year = year[0];
    var schoolYear = year.a+'-'+year.b;
    Student.find({yearEnrolled:schoolYear},function(error,students){
      console.log(year.a+'-'+year.b);
      console.log(students);
      if(error) console.log(error);
      if(students.length == 0) res
      var totalAmountUnpaid =0 ;
      var totalAmountPaid = 0;
      for(var i = 0; i < students.length;i++){
        for(var j = 0 ; j < students[i].unpaidFees.length; j++){
          totalAmountUnpaid += students[i].unpaidFees[j].price;
        }
        for(var j = 0; j < students[i].paidFees.length;j++){
          totalAmountPaid+= students[i].paidFees[j].price;
        }
      };
      return res.render('masterdetails',{totalAmount: totalAmountUnpaid+totalAmountPaid,totalAmountPaid: totalAmountPaid, totalAmountUnpaid:totalAmountUnpaid});
    })
  });
});

router.get('/printallunpaid', function(req, res, next){
  var unpaidStudents = [];
  Student.find({}, function(error, students){
    for(var i = 0; i < students.length; i++){
      if(students[i].unpaidFees.length != 0){
        var totalUnpaid = 0;
        for(var j = 0; j < students[i].unpaidFees.length; j++){
          totalUnpaid += students[i].unpaidFees[j].price;
        }
        var newFormStudent = {name: students[i].firstName +" "+students[i].lastName,studentNumber: students[i].studentNumber  ,total: totalUnpaid}
        unpaidStudents.push(newFormStudent);
      }
    }
    var totalUnpaid = 0;
    for(var i = 0 ; i < unpaidStudents.length; i++){
      totalUnpaid+= unpaidStudents[i].total;
    }
    console.log(unpaidStudents);
    return res.render('allunpaid', {students:unpaidStudents, totalUnpaid:totalUnpaid});
  });
});

router.get('/printallpaid', function(req, res, next){
  var paidStudents = [];
  Student.find({}, function(error, students){
    for(var i = 0; i < students.length; i++){
      if(students[i].paidFees.length != 0){
        var totalpaid = 0;
        for(var j = 0; j < students[i].paidFees.length; j++){
          totalpaid += students[i].paidFees[j].price;
        }
        var newFormStudent = {name: students[i].firstName +" "+students[i].lastName,studentNumber: students[i].studentNumber  ,total: totalpaid}
        paidStudents.push(newFormStudent);
      }
    }
    var totalpaid = 0;
    for(var i = 0 ; i < paidStudents.length; i++){
      totalpaid+= paidStudents[i].total;
    }
    return res.render('allpaid', {students:paidStudents, totalUnpaid:totalpaid});
  });
});

router.get('/printalltuition', function(req, res, next){
  CurrentYear.find({}, function(error, year){
    year = year[0];
    Student.find({yearEnrolled:year.a + "-"+year.b}, function(error,students){
      var paidStudents = [];
      for(var i = 0; i < students.length; i++){
        if(students[i].paidFees.length != 0){
          var totalpaid = 0;
          for(var j = 0; j < students[i].paidFees.length; j++){
            totalpaid += students[i].paidFees[j].price;
          }
          var newFormStudent = {name: students[i].firstName +" "+students[i].lastName,studentNumber: students[i].studentNumber  ,total: totalpaid}
          paidStudents.push(newFormStudent);
        }
      }
      var totalpaid = 0;
      for(var i = 0 ; i < paidStudents.length; i++){
        totalpaid+= paidStudents[i].total;
      }
      var unpaidStudents = [];
      for(var i = 0; i < students.length; i++){
        if(students[i].unpaidFees.length != 0){
          var totalUnpaid = 0;
          for(var j = 0; j < students[i].unpaidFees.length; j++){
            totalUnpaid += students[i].unpaidFees[j].price;
          }
          var newFormStudent = {name: students[i].firstName +" "+students[i].lastName,studentNumber: students[i].studentNumber  ,total: totalUnpaid}
          unpaidStudents.push(newFormStudent);
        }
      }
      var totalUnpaid = 0;
      for(var i = 0 ; i < unpaidStudents.length; i++){
        totalUnpaid+= unpaidStudents[i].total;
      }
      console.log(unpaidStudents)
      var date= new Date();
      return res.render('tuition_balance', {paidStudents:paidStudents, unpaidStudents: unpaidStudents, totalUnpaid: totalUnpaid, totalpaid: totalpaid,date:date });

    });
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

