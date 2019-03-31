const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text            : { type: String  , required: true },
  created_on      : { type: Date    , required: true },
  reported        : { type: Boolean , required: true },
  delete_password : { type: String  , required: true }
});

module.exports = replySchema; 
