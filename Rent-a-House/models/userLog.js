var mongoose = require("mongoose");

var userLogSchema = new mongoose.Schema({
   userID: Number,    
   email: String,
   action: String,
   ip: String,
   dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userLog", userLogSchema);