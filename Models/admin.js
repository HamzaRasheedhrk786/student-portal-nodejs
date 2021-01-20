const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const AdminSchema = new Schema({
  email:String,
  password:String
   
})
module.exports = mongoose.model('tbladmins',AdminSchema);