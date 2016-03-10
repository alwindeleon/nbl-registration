var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MiscFeeSchema = new Schema({
  name: String,
  price: Number,

});


mongoose.model('MiscFee', MiscFeeSchema);

