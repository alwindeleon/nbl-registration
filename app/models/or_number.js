var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var OrNumberSchema = new Schema({
  curNumber: Number
});

mongoose.model('OrNumber', OrNumberSchema);

