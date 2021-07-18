const mongoose = require("mongoose");

const ChatLogSchema = new mongoose.Schema({
  user : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
  message : { type : String , default : null },
  isSent : { type : Boolean }, // true for sent and false for message received,
  createdAt: { type: Number, default: function(){return new Date().getTime()}}
});

module.exports = mongoose.model("ChatLog", ChatLogSchema);