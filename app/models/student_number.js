var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SNSchema = new Schema({
  curNumber: Number,

});


mongoose.model('StudentNumber', SNSchema);

