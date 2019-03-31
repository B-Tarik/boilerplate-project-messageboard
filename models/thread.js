const mongoose = require('mongoose');
const replySchema = require('./reply')

const threadSchema = new mongoose.Schema({
  board           : {type: String, required: true},
  text            : {type: String, required: true},
  created_on      : {type: Date, required: true},
  bumped_on       : {type: Date, required: true},
  reported        : {type: Boolean, required: true},
  replies         : {type: [replySchema]},
  delete_password : {type: String, required: true},
}, {collection: 'boards'});

module.exports = mongoose.model('Thread', threadSchema);
