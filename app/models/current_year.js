var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CurrentYearSchema = new Schema({
  a: String,
  b: String,

});


mongoose.model('CurrentYear', CurrentYearSchema);

