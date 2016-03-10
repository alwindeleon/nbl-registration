var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SectionSchema = new Schema({
  name: String,
  level: String,
  room: String,

});


mongoose.model('Section', SectionSchema);

