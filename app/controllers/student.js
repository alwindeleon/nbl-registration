var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Section = mongoose.model('Section'),
  StudentNumber = mongoose.model('StudentNumber'),
  MiscFee = mongoose.model('MiscFee'),
  OrNumber = mongoose.model('OrNumber'),
  CurrentYear = mongoose.model('CurrentYear');

//constants
var nursery = 12500;
var kindergarten = 13500;
var preparatory = 14500;
var grade123 = 18500;
var grade456 = 21500;
var grade78 = 25500;
var grade910 = 28500;
var sem =['sem1', 'sem2'];
var quarter = ['quarter1','quarter2','quarter3','quarter4'];
var month =  [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
var possibleFees= sem.concat(quarter,month);
var discounts = ['early bird discount', 'residency discount', '2-sibling-discount','3-sibling-discount','4-sibling-discount','10-percent discount'];
module.exports = function (app) {
  app.use('/', router);
};


router.get('/register', function (req, res, next) {
  res.render('newOrOld')
});



router.get('/register/new', function (req, res, next) {
  res.render('register')
});

router.post('/register/old', function (req, res, next) {
   if(!req.body.studentNumber) res.render('newOrOld',{message:"please enter student number"});
  Student.findOne({studentNumber:req.body.studentNumber}, function(error,studentOld){
    if(error){
      console.log(error);
      return next(error);
    } 
    console.log(studentOld);
    if(!studentOld) return res.render('newOrOld',{message:"No Student with that Student Number"});
    var sections, miscFees;
    Section.find({},function(error, sectionsRes){
      if(error) {
        console.log(error,"sections");
        res.send({message:"error"});
      }
      sections = sectionsRes;
      MiscFee.find({}, function(error, miscFeesRes){
        if(error) {
          console.log(error,"misc");
          res.send({message:"error"});
        }
        miscFees = miscFeesRes;
        studentOld.save(function(error, studentNew){
          if(error) {
            console.log(error);
            res.send({message:"error"});
          }
          console.log(miscFees,sections,studentNew);
          console.log(discounts)
          res.render('assessment',{student:studentNew, sections:sections, miscFees: miscFees,discounts:discounts});
        });
      })
    });
    
  })

});


router.post('/register',function(req, res, next){
  // generate student number
  
  console.log(req.body);
  
  var curStudentNumber;
  StudentNumber.find({}, function(error,result){
    if(error) {
      console.log(error);
      res.send("error")
    }
    curStudentNumber = result[0];
    curStudentNumber.curNumber++;
    console.log(curStudentNumber);
    var newStudent = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName ,
      address: req.body.address,
      cellphoneNumber: req.body.cellphoneNumber,
      studentNumber: "NBL-"+pad(curStudentNumber.curNumber,4),
      curMiscFees: [], 
      unpaidFees: [], //same as cur misc fees
      paidFees: [],
      paymentHistory: [],
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      telephoneNum: req.body.telnum,
      nameOfFather: req.body.nameOfFather,
      nameOfMother: req.body.nameOfMother,
      nameOfGuardian: req.body.nameOfGuardian
    });
    curStudentNumber.save();

    var sections, miscFees;
    Section.find({},function(error, sectionsRes){
      if(error) {
        console.log(error,"sections");
        res.send({message:"error"});
      }
      sections = sectionsRes;
      MiscFee.find({}, function(error, miscFeesRes){
        if(error) {
          console.log(error,"misc");
          res.send({message:"error"});
        }
        miscFees = miscFeesRes;
        newStudent.save(function(error, student){
          if(error) {
            console.log(error);
            res.send({message:"error"});
          }
          console.log(miscFees,sections,student);
          res.render('assessment',{student:student, sections:sections, miscFees: miscFees,discounts:discounts});
        });
      })
    })
  });
});

router.post('/assess',function(req, res, next){
  console.log(req.body);
  Student.findOne({studentNumber: req.body.studentNumber}, function(error, student){
    if(error) {
      console.log(error);
      res.send('error');
    }
 
    student.section = req.body.section;
    student.yearEnrolled = req.body.schoolYear;
    student.yearLevel = req.body.yearLevel;
    student.modeOfPayment = req.body.modeOfPayment;
    //add unpaid fees and misc fees
    MiscFee.find({},function(error, miscFees){
      if(error) {
        console.log(error);
        res.send("error");
      }
      for(var i = 0 ; i < miscFees.length; i++){
        if(req.body.misc[i] != 0){
          student.unpaidFees.push({
            name: miscFees[i].name,
            quantity: req.body.misc[i],
            year: req.body.schoolYear,
            price: roundUp2Deci(miscFees[i].price)
          });
          student.curMiscFees.push({
            name: miscFees[i].name,
            quantity: req.body.misc[i],
            price:roundUp2Deci(miscFees[i].price)
          });
        }
      }
      if(req.body.modeOfPayment == 'semestral'){
        var perSem =0;
        if(student.yearLevel == 'nursery') perSem = nursery/2;
        else if(student.yearLevel == 'kinder') perSem = kinder/2;
        else if(student.yearLevel == 'preparatory') perSem = preparatory/2;
        else if(student.yearLevel == 'grade-1' || student.yearLevel == 'grade-2' || student.yearLevel == 'grade-3') perSem = grade123/2;
        else if(student.yearLevel == 'grade-4' || student.yearLevel == 'grade-5' || student.yearLevel == 'grade-6') perSem = grade456/2;
        else if(student.yearLevel == 'grade-7' || student.yearLevel == 'grade-8' ) perSem = grade78/2;
        else if(student.yearLevel == 'grade-9' || student.yearLevel == 'grade-10' ) perSem = grade910/2;
        for(var i = 0; i < sem.length; i++) {
          student.unpaidFees.push({
              name: sem[i],
              quantity: 1,
              year: req.body.schoolYear,
              price: roundUp2Deci(perSem)
            });
        }
      }else if(req.body.modeOfPayment = 'monthly'){
        var perMonth =0;
        if(student.yearLevel == 'nursery') perMonth = nursery/12;
        else if(student.yearLevel == 'kinder') perMonth = kinder/12;
        else if(student.yearLevel == 'preparatory') perMonth = preparatory/12;
        else if(student.yearLevel == 'grade-1' || student.yearLevel == 'grade-2' || student.yearLevel == 'grade-3') perMonth = grade123/12;
        else if(student.yearLevel == 'grade-4' || student.yearLevel == 'grade-5' || student.yearLevel == 'grade-6') perMonth = grade456/12;
        else if(student.yearLevel == 'grade-7' || student.yearLevel == 'grade-8' ) perMonth = grade78/12;
        else if(student.yearLevel == 'grade-9' || student.yearLevel == 'grade-10' ) perMonth = grade910/12;
        for(var i = 0; i < month.length; i++) {
          student.unpaidFees.push({
              name: month[i],
              quantity: 1,
              year: req.body.schoolYear,
              price: roundUp2Deci(perMonth)
            });
        }
      }else if(req.body.modeOfPayment = 'quarterly'){
        var perQuarter =0;
        if(student.yearLevel == 'nursery') perQuarter = nursery/4;
        else if(student.yearLevel == 'kinder') perQuarter = kinder/4;
        else if(student.yearLevel == 'preparatory') perQuarter = preparatory/4;
        else if(student.yearLevel == 'grade-1' || student.yearLevel == 'grade-2' || student.yearLevel == 'grade-3') perQuarter = grade123/4;
        else if(student.yearLevel == 'grade-4' || student.yearLevel == 'grade-5' || student.yearLevel == 'grade-6') perQuarter = grade456/4;
        else if(student.yearLevel == 'grade-7' || student.yearLevel == 'grade-8' ) perQuarter = grade78/4;
        else if(student.yearLevel == 'grade-9' || student.yearLevel == 'grade-10' ) perQuarter = grade910/4;
        for(var i = 0; i < quarter.length; i++) {
          student.unpaidFees.push({
              name: quarter[i],
              quantity: 1,
              year: req.body.schoolYear,
              price:roundUp2Deci(perQuarter)
            });
        }
      }else if(req.body.modeOfPayment = 'one'){
          var year =0;
          if(student.yearLevel == 'nursery') year = nursery;
          else if(student.yearLevel == 'kinder') year = kinder;
          else if(student.yearLevel == 'preparatory') year = preparatory;
          else if(student.yearLevel == 'grade-1' || student.yearLevel == 'grade-2' || student.yearLevel == 'grade-3') year = grade123;
          else if(student.yearLevel == 'grade-4' || student.yearLevel == 'grade-5' || student.yearLevel == 'grade-6') year = grade456;
          else if(student.yearLevel == 'grade-7' || student.yearLevel == 'grade-8' ) year = grade78;
          else if(student.yearLevel == 'grade-9' || student.yearLevel == 'grade-10' ) year = grade910;
          student.unpaidFees.push({
              name: 'one',
              quantity: 1,
              year: req.body.schoolYear,
              price: roundUp2Deci(year)
          });
      }
      student.save(function(error,student){
        if(error){
          console.log(error);
          res.send({message:error});
        }
        var total_tuition = 0;
        // add base tuition
        if(student.yearLevel == 'nursery') total_tuition += nursery;
        if(student.yearLevel == 'kinder') total_tuition += kinder;
        if(student.yearLevel == 'preparatory') total_tuition += preparatory;
        if(student.yearLevel == 'grade-1' || student.yearLevel == 'grade-2' || student.yearLevel == 'grade-3') total_tuition += grade123;
        if(student.yearLevel == 'grade-4' || student.yearLevel == 'grade-5' || student.yearLevel == 'grade-6') total_tuition += grade456;
        if(student.yearLevel == 'grade-7' || student.yearLevel == 'grade-8' ) total_tuition += grade78;
        if(student.yearLevel == 'grade-9' || student.yearLevel == 'grade-10' ) total_tuition += grade910;
        // add misc fees
        for(var i = 0 ; i < student.curMiscFees.length; i++){
          total_tuition += (student.curMiscFees[i].price*student.curMiscFees[i].quantity);
        }
        // create the breakdown json to be shown
        var items= [];
        for(var i = 0; i < student.unpaidFees.length; i++){
          items.push({
            name: student.unpaidFees[i].name,
            qty: student.unpaidFees[i].quantity,
            price: student.unpaidFees[i].price
          });
        }
        console.log(items);
        res.render('assessment_summary',{student:student,total_tuition:total_tuition,items:items})
      });
    });
  });
});

router.post('/profile', function(req, res, next){
  if(!req.body.studentNumber) res.render('index',{message:"please enter student number"});
  Student.findOne({studentNumber:req.body.studentNumber},function(error, student){
    if(error){
      console.log(error);
      return res.send({message:"error"});
    }
    if(!student){
      return res.render('index',{message:'No student with such student number'});
    }
    var total_unpaid = 0;
    for(var i = 0; i < student.unpaidFees.length; i++){
      total_unpaid += student.unpaidFees[i].price;
    }
    return res.render('profile',{student:student, total_unpaid: total_unpaid});
  })
});

router.get('/payment/:studentNumber', function(req, res, next){
  Student.findOne({studentNumber:req.params.studentNumber},function(error, student){
    if(error){
      console.log(error);
      return res.send("error");
    }
    if(!student){
      console.log(error)
      return res.send("error");
    }
    return res.render('payment',{student:student});

  });
});

router.post('/payment/:studentNumber',function(req, res, next){
  Student.findOne({studentNumber: req.params.studentNumber},function(error, student){
    var item;
    var total_payment = 0;
    var curHistory = [];
    if(error){
      console.log(error);
      return res.send("error");
    }
    OrNumber.findOne({},function(error, OR_NUMBER){
      if(error){
        console.log(error);
        return res.send("error");
      }
      if(!OR_NUMBER) console.log("VALUE IS NULL");
      console.log(OR_NUMBER);
      OR_NUMBER.curNumber++;
      for(var i = 0 ; i < req.body.itemsPaid.length; i++){
        for(var j = 0 ; j < student.unpaidFees.length; j++){
          if(req.body.itemsPaid[i] == student.unpaidFees[j].name){
            item = student.unpaidFees.splice(j, 1)[0];
            console.log(item);
            total_payment+=item.price;
            student.paidFees.push(item);
            var newHistory = {
              name: item.name,
              quantity: item.quantity,
              date: new Date(),
              amountReceived: item.price,
              orNumber: OR_NUMBER.curNumber,
              person: student.firstName+" "+student.lastName
            }
            student.paymentHistory.push(newHistory);
            curHistory.push(newHistory);
            OR_NUMBER.save();
            console.log(curHistory);
            break;
          }
        }
      };
      console.log(curHistory);
      student.save(function(error, student){
        var today = new Date();
        return res.render('payment_summary', {student:student,total_payment:total_payment,history: curHistory,date:today});
      });
    });
  });
});

router.get('/printtoday',function(req, res, next){
  console.log("INSIDE");
  Student.find({},function(error,students){
    console.log(error);
    if(error){
      console.log(error);
      return res.send('error');
    }
    if(!students || students.length == 0){
      res.render('index',{message:'0 students'});
    }
    var historyToday = [];
    var dateToday = new Date();
    for(var i = 0; i < students.length;i++){
      for(var j = 0; j < students[i].paymentHistory.length; j++){
        if(students[i].paymentHistory[j].date.getDate() == dateToday.getDate() &&
           students[i].paymentHistory[j].date.getMonth() == dateToday.getMonth() &&
           students[i].paymentHistory[j].date.getFullYear() == dateToday.getFullYear()){
              historyToday.push(students[i].paymentHistory[j]);
        }
      }
    }
    var total = 0;
    for(var i = 0; i < historyToday.length; i++){
      total += historyToday[i].amountReceived++;
    }
    console.log("ADSASD")
    return res.render('print_today',{history:historyToday,total:total,dateMonth:dateToday.getMonth(),dateDay:dateToday.getDate(),dateYear:dateToday.getFullYear()});
  });
});

router.get('/printmonth',function(req, res, next){
  Student.find({},function(error,students){
    if(error){
      console.log(error);
      return res.send('error');
    }
    if(!students || students.length == 0){
      res.render('index',{message:'0 students'});
    }
    var historyMonth = [];
    var dateToday = new Date();
    for(var i = 0; i < students.length;i++){
      for(var j = 0; j < students[i].paymentHistory.length; j++){
        if(students[i].paymentHistory[j].date.getMonth() == dateToday.getMonth() &&
           students[i].paymentHistory[j].date.getFullYear() == dateToday.getFullYear()){
              historyMonth.push(students[i].paymentHistory[j]);
        }
      }
    }
    var total = 0;
    for(var i = 0; i < historyMonth.length; i++){
      total += historyMonth[i].amountReceived;
    }
    return res.render('print_month',{history:historyMonth,total:total,dateMonth:dateToday.getMonth(),dateDay:dateToday.getDate(),dateYear:dateToday.getFullYear()});
  });
});

router.get('/setschoolyear',function(req, res, next){
  CurrentYear.find({},function(error, year){
    year = year[0];
    if(error){
      console.log(error);
      return res.send('error');
    }
    return res.render('set_school_year.jade',{a:year.a,b:year.b});
  });
});

router.post('/setschoolyear', function(req, res, next){
  CurrentYear.find({},function(error, year){
    if(error){
      console.log(error);
      return res.send('error');
    }
    console.log(req.body);
    year = year[0];
    year.a = req.body.year1;
    year.b = req.body.year2;
    year.save(function(error, newYear){
      console.log("updated");
      console.log(newYear);
      if(error){
        console.log(error);
        return res.send('error');
      }
      return res.render('index',{message:'School year updated'});
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