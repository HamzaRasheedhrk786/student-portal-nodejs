const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const SectionSchema = new Schema({
  name:{
      type:String,
      required:true
  }
   
})
module.exports = mongoose.model('tblsections',SectionSchema);