const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const AdminSchema = new Schema({
  email:{
      type:String,
      required:true
  },
  password:{
    type:String,
    required:true
}

   
})
module.exports = mongoose.model('tbladmins',AdminSchema);