var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  address: String,
  cellphoneNumber: String,
  section: String,
  studentNumber: String,
  yearEnrolled:String, // eg, "15,16"
  curMiscFees: [{
    name:String,
    quantity: Number,
    price: Number
  }], 
  modeOfPayment:String, // sem/quarterly/monthly
  unpaidFees: [{
    name:String,
    quantity:Number,
    year:String,
    price: Number // eg. 15-16
  }], //same as cur misc fees
  paidFees: [{
    name:String,
    quantity:Number,
    year:String,
    price:Number //eg. 15-16
  }],
  paymentHistory: [
    {
      name: String,
      quantity: Number,
      date: {type: Date, default:Date.now},
      amountReceived: Number,
      orNumber: Number,
      person: String
    }
  ],
  dateRegistered: {type:Date,default:Date.now},
  gender: String,
  dateOfBirth: String,
  telephoneNum: String,
  nameOfFather: String,
  nameOfFather: String,
  nameOfGuardian: String,
  yearLevel:String
});


mongoose.model('Student', StudentSchema);

