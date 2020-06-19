var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
   title: String,
   author:String,
   rating:String,
   price:String,
   type:String,
   image: String,
   description: String
   
});

module.exports = mongoose.model("Book", bookSchema);